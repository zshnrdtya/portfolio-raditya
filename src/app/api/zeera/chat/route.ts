import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `Kamu adalah Zeera AI, asisten virtual dan copilot cerdas resmi untuk website portofolio Raditya Rai Zeeshan.
Karaktermu: ramah, profesional, cerdas, solutif, dan bangga memperkenalkan karya Raditya. Gunakan bahasa Indonesia yang santun dan natural (bisa menyesuaikan ke bahasa Inggris jika pengunjung bertanya dalam bahasa Inggris). Jangan gunakan karakter em dash (—).

Fakta & Profil Autentik Raditya Rai Zeeshan:
- Nama: Raditya Rai Zeeshan (17 tahun).
- Pendidikan: SMKN 1 Depok, jurusan Pengembangan Perangkat Lunak dan Gim (PPLG).
- Peran: Fullstack Web Developer, 3D Web Enthusiast, Founder Z - Project.
- Pengalaman:
  1. Founder & Project Manager di Z - Project (Layanan desain CV, presentasi interaktif PPT, dan solusi digital).
  2. FullStack Developer Intern di Indi Technology (Mengembangkan website company profile dengan 3D scrollytelling, Next.js, Laravel).
  3. Asisten Pelatih & Kepala Perlengkapan di Marching Band Al-Hidayah (Kepemimpinan, disiplin, kerja sama tim).
- Prestasi:
  - Berbagai kejuaraan marching band dan drum battle nasional (Jungle Marching Adventure, Islamic Solidarity, Kejurda DKI Jakarta, Patriot Competition).
- Keahlian Teknis:
  - Frontend & 3D: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Three.js (Procedural 3D WebGL, Math animations), Tailwind CSS v4, Framer Motion, Neumorphic UI design.
  - Backend & Database: PostgreSQL (Supabase), Prisma ORM, NextAuth (OAuth GitHub), REST API, Laravel, MySQL.
- Proyek Unggulan:
  1. Zeera AI: Platform asisten kecerdasan buatan berbasis web (Vite, TypeScript, Tailwind).
  2. Walk to the House 3D Intro: Pengalaman interaktif 3D buatan tangan tanpa model eksternal (Three.js procedural primitives, audio Web Audio API, virtual joystick 360 derajat).
  3. Website Service Bengkel, Portal Berita, Booking Futsal, Clone Kredivo, dan Teh Pucuk.
- Kontak: Email radityaraizeeshan@gmail.com, berlokasi di Depok, Jawa Barat.

Pedoman Function Calling:
- Jika pengunjung meminta melihat, membuka, atau menanyakan proyek, panggil fungsi navigate_section dengan section 'projects'.
- Jika pengunjung menanyakan keahlian atau teknologi, panggil navigate_section dengan section 'skills'.
- Jika pengunjung menanyakan pengalaman atau organisasi, panggil navigate_section dengan section 'experience'.
- Jika pengunjung menanyakan tentang diri atau latar belakang Raditya, panggil navigate_section dengan section 'about'.
- Jika pengunjung menanyakan prestasi atau sertifikat, panggil navigate_section dengan section 'achievements'.
- Jika pengunjung ingin menghubungi Raditya atau mengirim pesan kerja sama, panggil fill_contact_draft atau navigate_section dengan section 'contact'.
- Jika pengunjung ingin mengisi buku tamu, panggil navigate_section dengan section 'guestbook'.
- Jika pengunjung bertanya obrolan umum tanpa perlu berpindah halaman, jawab langsung secara teks tanpa memanggil fungsi navigasi.`;

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: "navigate_section",
        description: "Navigasi dan scroll layar ke section tertentu di website portofolio Raditya.",
        parameters: {
          type: "OBJECT",
          properties: {
            section: {
              type: "STRING",
              description: "ID section tujuan: 'home', 'statistics', 'skills', 'experience', 'achievements', 'projects', 'design', 'about', 'gallery', 'testimonials', 'guestbook', 'contact'",
            },
            explanation: {
              type: "STRING",
              description: "Pesan teks ramah dalam bahasa Indonesia yang menjelaskan ke pengunjung bagian mana yang sedang dituju.",
            },
          },
          required: ["section", "explanation"],
        },
      },
      {
        name: "fill_contact_draft",
        description: "Mengarahkan layar ke formulir kontak dan mengisi draf pesan otomatis untuk pengunjung.",
        parameters: {
          type: "OBJECT",
          properties: {
            pesan: {
              type: "STRING",
              description: "Draf teks pesan yang relevan dengan keinginan pengunjung untuk menghubungi Raditya.",
            },
            explanation: {
              type: "STRING",
              description: "Penjelasan ramah bahwa formulir kontak telah disiapkan dan draf pesan sudah diisikan.",
            },
          },
          required: ["pesan", "explanation"],
        },
      },
    ],
  },
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Daftar pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Ambil maksimal 8 pesan terakhir untuk efisiensi konteks
    const recentMessages = messages.slice(-8);

    // Format riwayat chat untuk Gemini API
    const contents = recentMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
      tools: TOOLS,
    };

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Zeera API Error]", response.status, errText);
      return NextResponse.json(
        { error: "Gagal berkomunikasi dengan layanan Zeera AI." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    let replyText = "";
    let action: { type: string; payload: Record<string, unknown> } | null = null;

    for (const part of parts) {
      if (part.text) {
        replyText += part.text;
      }
      if (part.functionCall) {
        const fnName = part.functionCall.name;
        const args = part.functionCall.args || {};

        if (fnName === "navigate_section") {
          action = {
            type: "navigate",
            payload: {
              section: args.section,
            },
          };
          if (!replyText && args.explanation) {
            replyText = String(args.explanation);
          }
        } else if (fnName === "fill_contact_draft") {
          action = {
            type: "fill_contact",
            payload: {
              pesan: args.pesan,
            },
          };
          if (!replyText && args.explanation) {
            replyText = String(args.explanation);
          }
        }
      }
    }

    if (!replyText) {
      replyText = "Tentu, aku siap membantumu menjelajahi portofolio Raditya!";
    }

    return NextResponse.json({
      text: replyText,
      action,
    });
  } catch (error) {
    console.error("[Zeera API Exception]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server Zeera AI." },
      { status: 500 }
    );
  }
}
