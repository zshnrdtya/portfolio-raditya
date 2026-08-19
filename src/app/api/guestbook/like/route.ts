import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/guestbook/like — Increment likes on a message
export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID komentar tidak valid." },
        { status: 400 }
      );
    }

    const updatedMessage = await prisma.guestbook.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      { success: true, likes: updatedMessage.likes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Guestbook Like error:", error);
    return NextResponse.json(
      { error: "Gagal memberikan like." },
      { status: 500 }
    );
  }
}
