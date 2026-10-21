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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/projects - Ambil semua proyek (admin only)
export async function GET() {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API /admin/projects GET] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar proyek admin." },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects - Tambah proyek baru
export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, image, techStack, demoUrl, githubUrl, order, published } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Nama/judul proyek wajib diisi." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Deskripsi proyek wajib diisi." },
        { status: 400 }
      );
    }

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { error: "Foto atau URL gambar proyek wajib diisi." },
        { status: 400 }
      );
    }

    const baseSlug = generateSlug(title) || `project-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    // Pastikan slug unik
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const cleanedTechStack = Array.isArray(techStack)
      ? techStack.map((t: string) => String(t).trim()).filter(Boolean)
      : [];

    const newProject = await prisma.project.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        image: image.trim(),
        techStack: cleanedTechStack,
        demoUrl: demoUrl ? String(demoUrl).trim() : null,
        githubUrl: githubUrl ? String(githubUrl).trim() : null,
        order: typeof order === "number" ? order : 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("[API /admin/projects POST] Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan proyek baru." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/projects - Update data proyek
export async function PUT(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, image, techStack, demoUrl, githubUrl, order, published } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID proyek diperlukan untuk pembaruan." },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan." },
        { status: 404 }
      );
    }

    const cleanedTechStack = Array.isArray(techStack)
      ? techStack.map((t: string) => String(t).trim()).filter(Boolean)
      : existing.techStack;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existing.title,
        description: description !== undefined ? String(description).trim() : existing.description,
        image: image !== undefined ? String(image).trim() : existing.image,
        techStack: cleanedTechStack,
        demoUrl: demoUrl !== undefined ? (demoUrl ? String(demoUrl).trim() : null) : existing.demoUrl,
        githubUrl: githubUrl !== undefined ? (githubUrl ? String(githubUrl).trim() : null) : existing.githubUrl,
        order: typeof order === "number" ? order : existing.order,
        published: published !== undefined ? Boolean(published) : existing.published,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("[API /admin/projects PUT] Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data proyek." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects - Hapus proyek
export async function DELETE(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter ID proyek diperlukan." },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Proyek berhasil dihapus." });
  } catch (error) {
    console.error("[API /admin/projects DELETE] Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus proyek." },
      { status: 500 }
    );
  }
}
