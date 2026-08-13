import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
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

    // 1. Simpan ke database (prioritas utama)
    const message = await prisma.contactMessage.create({
      data: {
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        pesan: pesan.trim(),
      },
    });

    // 2. Kirim notifikasi email via Resend (opsional — tidak memblokir response)
    try {
      // Guard: pastikan env vars tersedia
      if (!process.env.RESEND_API_KEY) {
        console.warn("Resend: RESEND_API_KEY belum diset, skip kirim email.");
      } else if (!process.env.MY_EMAIL) {
        console.warn("Resend: MY_EMAIL belum diset, skip kirim email.");
      } else {
        // Inisiasi Resend di dalam handler agar env var sudah terbaca
        const resend = new Resend(process.env.RESEND_API_KEY);

        const timestamp = new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          dateStyle: "full",
          timeStyle: "short",
        });

        const { data, error: resendError } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: process.env.MY_EMAIL,
          subject: `📬 Pesan Baru dari ${nama.trim()} — Portfolio`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
              <div style="background: #1e293b; padding: 28px 32px;">
                <h1 style="margin: 0; color: #f1f5f9; font-size: 20px; font-weight: 700;">
                  📬 Pesan Baru dari Portfolio
                </h1>
              </div>
              <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #64748b; font-size: 13px; width: 110px; vertical-align: top;">Nama</td>
                    <td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${nama.trim()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #64748b; font-size: 13px; vertical-align: top;">Email</td>
                    <td style="padding: 10px 0;">
                      <a href="mailto:${email.trim()}" style="color: #6366f1; font-size: 15px;">${email.trim()}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #64748b; font-size: 13px; vertical-align: top;">Waktu</td>
                    <td style="padding: 10px 0; color: #0f172a; font-size: 14px;">${timestamp}</td>
                  </tr>
                </table>

                <div style="margin-top: 20px; padding: 18px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #6366f1;">
                  <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Pesan</p>
                  <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${pesan.trim()}</p>
                </div>

                <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px;">
                  ID Pesan: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${message.id}</code>
                </p>
              </div>
            </div>
          `,
        });

        // Log response lengkap dari Resend API agar terlihat di Vercel Logs
        if (resendError) {
          console.error("RESEND ERROR DETAILS:", resendError);
          console.error("RESEND ERROR name:", resendError.name);
          console.error("RESEND ERROR message:", resendError.message);
        } else {
          console.log("Resend email sent OK, id:", data?.id);
        }
      }
    } catch (emailError: unknown) {
      // Email gagal terkirim — TIDAK memblokir response sukses
      // Pesan sudah tersimpan di database
      console.error("RESEND ERROR DETAILS:", emailError);
      if (emailError instanceof Error) {
        console.error("RESEND ERROR name:", emailError.name);
        console.error("RESEND ERROR message:", emailError.message);
        console.error("RESEND ERROR stack:", emailError.stack);
      }
    }

    return NextResponse.json(
      { success: true, id: message.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Contact API Error:", error);
    if (error instanceof Error) {
      console.error("Contact API Error message:", error.message);
      console.error("Contact API Error stack:", error.stack);
    }

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
