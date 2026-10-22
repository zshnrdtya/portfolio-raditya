import type { NextRequest } from 'next/server';
import { prisma } from './prisma';

export const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';

/**
 * Mendapatkan konfigurasi RP ID dan Origin WebAuthn secara dinamis
 * sesuai host request (baik di localhost maupun domain produksi).
 */
export function getPasskeyRPOptions(request?: NextRequest | Request) {
  let hostname = 'localhost';
  let origin = 'http://localhost:3000';

  if (request) {
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protoHeader = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    if (hostHeader) {
      hostname = hostHeader.split(':')[0];
      origin = `${protoHeader}://${hostHeader}`;
    }
  } else if (process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL);
      hostname = url.hostname;
      origin = url.origin;
    } catch {
      // Fallback ke localhost jika NEXTAUTH_URL tidak valid
    }
  }

  return {
    rpName: 'Dashraditya Portofolio',
    rpID: hostname,
    origin,
  };
}

/**
 * Membersihkan challenge WebAuthn yang telah kadaluarsa dari database.
 */
export async function cleanupExpiredChallenges(): Promise<void> {
  try {
    await prisma.passkeyChallenge.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  } catch (error) {
    console.error('Gagal membersihkan challenge kadaluarsa:', error);
  }
}
