import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL, getPasskeyRPOptions, cleanupExpiredChallenges } from '@/lib/passkey';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Akses ditolak. Sesi administrator diperlukan.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      response?: RegistrationResponseJSON;
      deviceName?: string;
    };

    if (!body?.response) {
      return NextResponse.json({ error: 'Data pendaftaran biometrik tidak valid.' }, { status: 400 });
    }

    await cleanupExpiredChallenges();

    // Cari challenge aktif
    const activeChallenge = await prisma.passkeyChallenge.findFirst({
      where: {
        type: 'REGISTRATION',
        userEmail: ADMIN_EMAIL,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeChallenge) {
      return NextResponse.json(
        { error: 'Sesi pendaftaran biometrik telah kadaluarsa. Silakan coba kembali.' },
        { status: 400 }
      );
    }

    const { rpID, origin } = getPasskeyRPOptions(request);

    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge: activeChallenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: 'Verifikasi pendaftaran biometrik gagal dilakukan perangkat.' },
        { status: 400 }
      );
    }

    const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    const credIdStr = isoBase64URL.fromBuffer(credentialID);
    const pubKeyStr = isoBase64URL.fromBuffer(credentialPublicKey);
    const transports = (body.response.response as { transports?: string[] })?.transports || [];

    // Simpan kredensial baru ke database
    await prisma.passkeyCredential.upsert({
      where: { id: credIdStr },
      create: {
        id: credIdStr,
        userId: ADMIN_EMAIL,
        publicKey: pubKeyStr,
        counter: BigInt(counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports,
        deviceName: body.deviceName?.trim() || 'Perangkat Administrator',
      },
      update: {
        publicKey: pubKeyStr,
        counter: BigInt(counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports,
        deviceName: body.deviceName?.trim() || 'Perangkat Administrator',
      },
    });

    // Hapus challenge yang sudah berhasil diverifikasi
    await prisma.passkeyChallenge.delete({
      where: { id: activeChallenge.id },
    });

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error('Error verify registration:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memverifikasi pendaftaran biometrik.' },
      { status: 500 }
    );
  }
}
