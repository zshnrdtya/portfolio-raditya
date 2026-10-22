import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractVisitorMetadata, cleanReferrer } from '@/lib/telemetry';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      sessionId?: string;
      path?: string;
      referrer?: string;
    };

    const sessionId = (body.sessionId?.trim() || `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`).slice(0, 64);
    const path = (body.path?.trim() || '/').slice(0, 100);
    const referrer = cleanReferrer(body.referrer);
    const { device, browser, country, city } = extractVisitorMetadata(request);

    // Cari sesi yang aktif dalam 30 menit terakhir
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingSession = await prisma.visitorLog.findFirst({
      where: {
        sessionId,
        lastSeenAt: { gt: thirtyMinutesAgo },
      },
    });

    if (existingSession) {
      await prisma.visitorLog.update({
        where: { id: existingSession.id },
        data: {
          lastSeenAt: new Date(),
          path,
        },
      });
    } else {
      await prisma.visitorLog.create({
        data: {
          sessionId,
          path,
          referrer,
          device,
          browser,
          country,
          city,
          lastSeenAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Error in telemetry ping:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
