import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL } from '@/lib/passkey';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [devicesGroup, countriesGroup, referrersGroup, logsLast7Days] = await Promise.all([
      prisma.visitorLog.groupBy({
        by: ['device'],
        _count: { id: true },
      }),
      prisma.visitorLog.groupBy({
        by: ['country'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.visitorLog.groupBy({
        by: ['referrer'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.visitorLog.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Format tren 7 hari terakhir
    const dailyMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      dailyMap.set(dateKey, 0);
    }

    logsLast7Days.forEach((log) => {
      const dateKey = new Date(log.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
      if (dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
      }
    });

    const dailyTrend = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({
      devices: devicesGroup.map((d) => ({ device: d.device, count: d._count.id })),
      countries: countriesGroup.map((c) => ({ country: c.country, count: c._count.id })),
      referrers: referrersGroup.map((r) => ({
        referrer: r.referrer || 'Langsung (Direct)',
        count: r._count.id,
      })),
      dailyTrend,
    });
  } catch (error) {
    console.error('Error in telemetry stats:', error);
    return NextResponse.json({ error: 'Gagal memuat analitik radar.' }, { status: 500 });
  }
}
