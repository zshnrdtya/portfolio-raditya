import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { AuthenticationResponseJSON, AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL, getPasskeyRPOptions, cleanupExpiredChallenges } from '@/lib/passkey';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { response?: AuthenticationResponseJSON };

    if (!body?.response || !body.response.id) {
      return NextResponse.json({ error: 'Data autentikasi biometrik tidak valid.' }, { status: 400 });
    }

    await cleanupExpiredChallenges();

    // Dapatkan kredensial yang cocok dari database
    const credential = await prisma.passkeyCredential.findUnique({
      where: { id: body.response.id },
    });

    if (!credential) {
      return NextResponse.json(
        { error: 'Kredensial biometrik ini tidak terdaftar di sistem.' },
        { status: 404 }
      );
    }

    // Cari challenge aktif
    const activeChallenge = await prisma.passkeyChallenge.findFirst({
      where: {
        type: 'AUTHENTICATION',
        userEmail: ADMIN_EMAIL,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeChallenge) {
      return NextResponse.json(
        { error: 'Sesi autentikasi telah kadaluarsa. Silakan coba kembali.' },
        { status: 400 }
      );
    }

    const { rpID, origin } = getPasskeyRPOptions(request);

    const verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge: activeChallenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: isoBase64URL.toBuffer(credential.id),
        credentialPublicKey: isoBase64URL.toBuffer(credential.publicKey),
        counter: Number(credential.counter),
        transports: credential.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified || !verification.authenticationInfo) {
      return NextResponse.json(
        { error: 'Verifikasi biometrik tidak berhasil. Silakan coba kembali.' },
        { status: 400 }
      );
    }

    // Update counter dan waktu terakhir digunakan
    await prisma.passkeyCredential.update({
      where: { id: credential.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Hapus challenge autentikasi
    await prisma.passkeyChallenge.delete({
      where: { id: activeChallenge.id },
    });

    // Buat tiket sekali pakai untuk sesi NextAuth (valid 60 detik)
    const ticket = randomBytes(32).toString('hex');
    await prisma.passkeyChallenge.create({
      data: {
        challenge: ticket,
        type: 'LOGIN_TICKET',
        userEmail: ADMIN_EMAIL,
        expiresAt: new Date(Date.now() + 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      ticket,
    });
  } catch (error) {
    console.error('Error verify authentication:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memverifikasi biometrik.' },
      { status: 500 }
    );
  }
}
