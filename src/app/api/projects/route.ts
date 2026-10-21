import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("[API /api/projects GET] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar proyek." },
      { status: 500 }
    );
  }
}
