import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { SectionKey } from '@/lib/siteContent';

const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';

const VALID_SECTIONS: SectionKey[] = ['hero', 'statistics', 'about', 'contact'];

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { section, data } = body;

    if (!section || !VALID_SECTIONS.includes(section as SectionKey)) {
      return NextResponse.json(
        { error: 'Section tidak valid atau tidak didukung.' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Data konten section tidak valid.' },
        { status: 400 }
      );
    }

    const updated = await prisma.siteContent.upsert({
      where: { section },
      update: {
        data,
      },
      create: {
        section,
        data,
      },
    });

    return NextResponse.json({
      success: true,
      section: updated.section,
      data: updated.data,
    });
  } catch (error) {
    console.error('[API /api/admin/content] PUT error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan perubahan konten ke database.' },
      { status: 500 }
    );
  }
}
