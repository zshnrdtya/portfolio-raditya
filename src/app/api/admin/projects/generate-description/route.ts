import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGeminiApiKey } from "@/lib/gemini";

const ADMIN_EMAIL = "radityaraizeeshan@gmail.com";

const ANTISLOP_COPYWRITING_SYSTEM_INSTRUCTION = `You are a concise, technical copywriter creating a short project description for a developer portfolio.
You MUST strictly adhere to the following anti-slop copywriting standards:

1. FORBIDDEN BUZZWORDS (Never use any of these words or their variations):
   delve, elevate, empower, seamless, game-changer, revolutionary, robust, cutting-edge, unlock, landscape, journey, testament, next-level, showcase, streamline, enhance, unleash, dive deep, harness, state-of-the-art.

2. FORBIDDEN CLAIMS (Never exaggerate significance):
   Never write "marking a pivotal moment", "ushering in a new era", "revolutionizing the way", "game-changing", "trusted by thousands", "industry-leading", or "world-class".

3. HARD BAN ON EM DASH:
   Never use the em dash character. Use a comma, period, or parentheses instead.

4. FORMAT AND LENGTH:
   - Exactly 1 to 2 sentences.
   - 15 to 30 words total.
   - Factual, clear, and focused on core functionality and purpose.
   - Direct active voice.
   - Return ONLY the final description text, without quotation marks, bullet points, introductory phrases, or markdown formatting.

Example good outputs:
- "A web application for automotive repair services with scheduling and customer management features."
- "An integrated futsal field booking platform with real-time schedule availability and status tracking."
- "A responsive digital news portal featuring a fast content management system and category filtering."
- "A 3D axe asset crafted with hand-painted textures and calibrated lighting for game engine integration."`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { title, techStack, language = "en" } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Nama/judul proyek diperlukan untuk membuat deskripsi." },
        { status: 400 }
      );
    }

    const techInfo = Array.isArray(techStack) && techStack.length > 0
      ? ` Built using: ${techStack.join(", ")}.`
      : "";

    const langInstruction = language === "id"
      ? "Write the description in natural Indonesian."
      : "Write the description in English.";

    const userPrompt = `Project Title: ${title.trim()}.${techInfo}
${langInstruction}
Write a concise, factual 1-2 sentence description adhering strictly to the anti-slop rules.`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: ANTISLOP_COPYWRITING_SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 120,
      },
    };

    const CANDIDATE_MODELS = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.5-flash",
    ];

    let response: Response | null = null;
    let lastError = "";

    for (const model of CANDIDATE_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(geminiPayload),
        });

        if (res.ok) {
          response = res;
          break;
        } else {
          const errText = await res.text();
          lastError = `Model ${model} (${res.status}): ${errText.slice(0, 100)}`;
        }
      } catch (fetchErr) {
        lastError = String(fetchErr);
      }
    }

    if (!response || !response.ok) {
      console.error("[Generate Description API Error]", lastError);
      return NextResponse.json(
        { error: `Gagal menghasilkan deskripsi: ${lastError || "Layanan Gemini AI sibuk. Silakan coba kembali."}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    let generatedText = "";
    for (const part of parts) {
      if (part.text && !part.thought) {
        generatedText += part.text;
      }
    }
    if (!generatedText && parts.length > 0 && parts[0].text) {
      generatedText = parts[0].text;
    }

    generatedText = generatedText.replace(/^["']|["']$/g, "").trim();
    generatedText = generatedText.replace(/—/g, ", ");

    return NextResponse.json({
      description: generatedText,
    });
  } catch (error) {
    console.error("[Generate Description Exception]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat membuat deskripsi." },
      { status: 500 }
    );
  }
}
