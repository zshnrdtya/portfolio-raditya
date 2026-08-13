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
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
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
  } catch (error: unknown) {
    // Log detail lengkap agar terbaca di Vercel Logs
    console.error("Contact API Error:", error);

    if (error instanceof Error) {
      console.error("Contact API Error message:", error.message);
      console.error("Contact API Error stack:", error.stack);
    }

    // Tampilkan pesan error di response saat development
    const isDev = process.env.NODE_ENV === "development";
    const detail =
      isDev && error instanceof Error ? error.message : undefined;

    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server. Silakan coba lagi.",
        ...(detail ? { detail } : {}),
      },
      { status: 500 }
    );
  }
}
