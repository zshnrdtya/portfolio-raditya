import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

const ADMIN_EMAIL = "radityaraizeeshan@gmail.com";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }
  if (mimeType === "image/gif") {
    return (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    );
  }
  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }
  return false;
}

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

    const safeExtension = MIME_EXTENSION_MAP[file.type];
    if (!safeExtension) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap unggah PNG, JPG, JPEG, WebP, atau GIF." },
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

    if (!isValidImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "File yang diunggah rusak atau bukan format gambar valid." },
        { status: 400 }
      );
    }

    const originalExt = path.extname(file.name).toLowerCase();
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);

    const folder = (formData.get("folder") as string | null)?.toLowerCase() || "project";
    const isAboutFolder = folder === "about" || folder === "raditya";
    const targetSubdir = isAboutFolder ? "foto-raditya" : "foto-project";
    const filePrefix = isAboutFolder ? "raditya" : "project";

    const randomSuffix = crypto.randomBytes(4).toString("hex");
    const safeFileName = `${filePrefix}-${Date.now()}-${randomSuffix}-${baseName}${safeExtension}`;

    const uploadDir = path.resolve(process.cwd(), "public", targetSubdir);
    const filePath = path.resolve(uploadDir, safeFileName);

    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json(
        { error: "Path file traversal terdeteksi." },
        { status: 400 }
      );
    }

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName: safeFileName,
      url: `/${targetSubdir}/${safeFileName}`,
    });
  } catch (error) {
    console.error("[Upload API Error]", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file gambar ke server." },
      { status: 500 }
    );
  }
}
