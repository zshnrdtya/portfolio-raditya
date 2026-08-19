import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ADMIN_EMAIL = "radityaraizeeshan@gmail.com";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return null;
  }
  return session;
}

// GET /api/admin/guestbook — Fetch pending messages (admin only)
export async function GET() {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.guestbook.findMany({
      where: { status: "PENDING" },
      include: {
        parent: {
          select: {
            author_name: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Admin Guestbook GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat pesan." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/guestbook — Approve or Reject a message (admin only)
export async function PATCH(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID pesan diperlukan." },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status harus APPROVED atau REJECTED." },
        { status: 400 }
      );
    }

    const updated = await prisma.guestbook.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("Admin Guestbook PATCH error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status." },
      { status: 500 }
    );
  }
}
