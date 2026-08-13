import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, email, pesan } = body;

    // Validasi input
    if (!nama || typeof nama !== "string" || nama.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama harus diisi minimal 2 karakter." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }
    if (!pesan || typeof pesan !== "string" || pesan.trim().length < 10) {
      return NextResponse.json(
        { error: "Pesan harus diisi minimal 10 karakter." },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        pesan: pesan.trim(),
      },
    });

    return NextResponse.json(
      { success: true, id: message.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /contact] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
