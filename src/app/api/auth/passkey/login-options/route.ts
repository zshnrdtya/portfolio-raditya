import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL, getPasskeyRPOptions, cleanupExpiredChallenges } from '@/lib/passkey';

export async function GET(request: Request) {
  try {
    await cleanupExpiredChallenges();

    const existingCredentials = await prisma.passkeyCredential.findMany({
      where: { userId: ADMIN_EMAIL },
      select: { id: true, transports: true },
    });

    if (existingCredentials.length === 0) {
      return NextResponse.json({
        hasCredentials: false,
        message: 'Belum ada perangkat biometrik yang didaftarkan.',
      });
    }

    const { rpID } = getPasskeyRPOptions(request);

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: existingCredentials.map((cred) => ({
        id: isoBase64URL.toBuffer(cred.id),
        type: 'public-key' as const,
        transports: cred.transports as AuthenticatorTransportFuture[],
      })),
    });

    // Simpan challenge ke database
    await prisma.passkeyChallenge.create({
      data: {
        challenge: options.challenge,
        type: 'AUTHENTICATION',
        userEmail: ADMIN_EMAIL,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
      },
    });

    return NextResponse.json({
      hasCredentials: true,
      options,
    });
  } catch (error) {
    console.error('Error generate login options:', error);
    return NextResponse.json(
      { error: 'Gagal membuat opsi autentikasi biometrik.' },
      { status: 500 }
    );
  }
}
