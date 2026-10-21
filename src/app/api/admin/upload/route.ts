import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

const ADMIN_EMAIL = "radityaraizeeshan@gmail.com";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file gambar yang diunggah." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap unggah PNG, JPG, WebP, atau SVG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ambil ekstensi asli yang aman
    const originalExt = path.extname(file.name).toLowerCase() || ".png";
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);

    const safeFileName = `project-${Date.now()}-${baseName}${originalExt}`;
    const uploadDir = path.join(process.cwd(), "public", "foto-project");

    // Pastikan folder ada
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName: safeFileName,
      url: `/foto-project/${safeFileName}`,
    });
  } catch (error) {
    console.error("[Upload API Error]", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file gambar ke server." },
      { status: 500 }
    );
  }
}
