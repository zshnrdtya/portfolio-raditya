import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/guestbook — Fetch approved messages with replies
export async function GET() {
  try {
    const messages = await prisma.guestbook.findMany({
      where: { 
        status: "APPROVED",
        parentId: null, // Only fetch top-level comments
      },
      include: {
        replies: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "asc" }, // Oldest replies first
        }
      },
      orderBy: { createdAt: "desc" }, // Newest comments first
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Guestbook GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat pesan." },
      { status: 500 }
    );
  }
}

// POST /api/guestbook — Submit a new message (always PENDING)
export async function POST(req: NextRequest) {
  try {
    const { body, parentId } = await req.json();

    // Validate body
    if (!body || typeof body !== "string" || body.trim().length < 3) {
      return NextResponse.json(
        { error: "Pesan harus minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (body.trim().length > 500) {
      return NextResponse.json(
        { error: "Pesan maksimal 500 karakter." },
        { status: 400 }
      );
    }

    // Check session for author info
    const session = await auth();
    const author_name = session?.user?.name || "Anonymous";
    const avatar_url = session?.user?.image || null;

    const message = await prisma.guestbook.create({
      data: {
        body: body.trim(),
        author_name,
        avatar_url,
        status: "PENDING",
        parentId: parentId || null,
      },
    });

    return NextResponse.json(
      { success: true, id: message.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guestbook POST error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan." },
      { status: 500 }
    );
  }
}
