import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/projects/stats?slug=nama-project
// Ambil stats (likes & views) untuk satu project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Parameter 'slug' diperlukan." },
        { status: 400 }
      );
    }

    // Upsert: buat record baru jika belum ada, atau ambil yang sudah ada
    const stat = await prisma.projectStat.upsert({
      where: { slug },
      create: { slug, likes: 0, views: 0 },
      update: {},
    });

    return NextResponse.json({ slug: stat.slug, likes: stat.likes, views: stat.views });
  } catch (error) {
    console.error("[API /projects/stats GET] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// POST /api/projects/stats
// Body: { slug: string, action: "like" | "view" }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, action } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Field 'slug' diperlukan." },
        { status: 400 }
      );
    }
    if (action !== "like" && action !== "view") {
      return NextResponse.json(
        { error: "Field 'action' harus bernilai 'like' atau 'view'." },
        { status: 400 }
      );
    }

    const stat = await prisma.projectStat.upsert({
      where: { slug },
      create: {
        slug,
        likes: action === "like" ? 1 : 0,
        views: action === "view" ? 1 : 0,
      },
      update: {
        likes: action === "like" ? { increment: 1 } : undefined,
        views: action === "view" ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json({ slug: stat.slug, likes: stat.likes, views: stat.views });
  } catch (error) {
    console.error("[API /projects/stats POST] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
