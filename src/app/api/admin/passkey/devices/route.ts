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

    const devices = await prisma.passkeyCredential.findMany({
      where: { userId: ADMIN_EMAIL },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Error fetching passkey devices:', error);
    return NextResponse.json({ error: 'Gagal memuat daftar perangkat biometrik.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID perangkat diperlukan.' }, { status: 400 });
    }

    await prisma.passkeyCredential.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Perangkat berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting passkey device:', error);
    return NextResponse.json({ error: 'Gagal menghapus perangkat.' }, { status: 500 });
  }
}
