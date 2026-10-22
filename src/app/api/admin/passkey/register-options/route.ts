import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL, getPasskeyRPOptions, cleanupExpiredChallenges } from '@/lib/passkey';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Akses ditolak. Sesi administrator diperlukan.' }, { status: 401 });
    }

    await cleanupExpiredChallenges();

    // Dapatkan kredensial yang sudah terdaftar untuk diexclude
    const existingCredentials = await prisma.passkeyCredential.findMany({
      where: { userId: ADMIN_EMAIL },
      select: { id: true, transports: true },
    });

    const { rpName, rpID } = getPasskeyRPOptions(request);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: isoBase64URL.fromBuffer(Buffer.from(ADMIN_EMAIL)),
      userName: ADMIN_EMAIL,
      userDisplayName: 'Raditya Rai Zeeshan (Admin)',
      attestationType: 'none',
      excludeCredentials: existingCredentials.map((cred) => ({
        id: isoBase64URL.toBuffer(cred.id),
        type: 'public-key' as const,
        transports: cred.transports as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Simpan challenge ke database
    await prisma.passkeyChallenge.create({
      data: {
        challenge: options.challenge,
        type: 'REGISTRATION',
        userEmail: ADMIN_EMAIL,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
      },
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error generate registration options:', error);
    return NextResponse.json(
      { error: 'Gagal membuat opsi pendaftaran Face ID / Biometrik.' },
      { status: 500 }
    );
  }
}
