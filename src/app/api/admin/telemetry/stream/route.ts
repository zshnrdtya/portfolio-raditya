import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL } from '@/lib/passkey';

export const dynamic = 'force-dynamic';

async function getTelemetrySnapshot() {
  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Ambil data pengunjung yang aktif dalam 3 menit terakhir
  const activeVisitors = await prisma.visitorLog.findMany({
    where: {
      lastSeenAt: { gt: threeMinutesAgo },
    },
    select: {
      id: true,
      sessionId: true,
      device: true,
      browser: true,
      country: true,
      city: true,
      path: true,
      referrer: true,
      createdAt: true,
      lastSeenAt: true,
    },
    orderBy: { lastSeenAt: 'desc' },
    take: 20,
  });

  // Statistik hari ini
  const [todayVisitsCount, uniqueSessionsCount] = await Promise.all([
    prisma.visitorLog.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.visitorLog.groupBy({
      by: ['sessionId'],
      where: { createdAt: { gte: startOfToday } },
    }),
  ]);

  return {
    activeCount: activeVisitors.length,
    activeVisitors,
    todayStats: {
      totalViews: todayVisitsCount,
      uniqueVisitors: uniqueSessionsCount.length,
    },
    timestamp: Date.now(),
  };
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Akses ditolak.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let isClosed = false;

        const sendEvent = async () => {
          if (isClosed) return;
          try {
            const data = await getTelemetrySnapshot();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (err) {
            console.error('Error streaming telemetry data:', err);
          }
        };

        // Kirim snapshot pertama kali
        await sendEvent();

        // Loop interval setiap 3 detik
        const intervalId = setInterval(sendEvent, 3000);

        // Bersihkan interval saat koneksi ditutup / di-abort
        request.signal.addEventListener('abort', () => {
          isClosed = true;
          clearInterval(intervalId);
          try {
            controller.close();
          } catch {
            // Abaikan jika sudah tertutup
          }
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error initializing telemetry stream:', error);
    return new Response(JSON.stringify({ error: 'Gagal membuka live stream radar.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
