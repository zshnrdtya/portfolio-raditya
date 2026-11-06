"use client";

import React, { useState } from "react";
import MagnetButton from "@/components/primitives/MagnetButton";
import TiltedCard from "@/components/primitives/TiltedCard";

/**
 * ContactSection — Jalur komunikasi langsung tanpa form palsu.
 * Mengikuti standar antislop-copywriting & antislop-logic (bebas mock data tak berfungsi).
 */
export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "radityaraizeeshan@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      aria-label="Informasi Kontak Langsung"
      className="relative z-10 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <TiltedCard maxTilt={4} className="p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest text-[#00F59B] uppercase">
              Jalur Komunikasi Langsung
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F1F5F9] sm:text-4xl">
              Mari Bangun Solusi Bersama
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Saya terbuka untuk proyek freelance, perancangan web performa
              tinggi, dan peluang kolaborasi teknis. Hubungi langsung melalui
              email atau eksplorasi kode saya di GitHub.
            </p>

            {/* Email Address Display with Copy Button */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-lg border border-[#1E2433] bg-[#08090C] px-4 py-2.5 font-mono text-sm text-[#F1F5F9]">
                {email}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Salin alamat email"
                className="rounded-lg border border-[#1E2433] bg-[#151922] px-3.5 py-2.5 font-mono text-xs text-[#94A3B8] transition-colors hover:border-[#00F59B] hover:text-[#00F59B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F59B]"
              >
                {copied ? "Tersalin!" : "Salin Email"}
              </button>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagnetButton
                href={`mailto:${email}`}
                variant="primary"
                className="text-sm"
              >
                Kirim Pesan Email
              </MagnetButton>

              <MagnetButton
                href="https://github.com/zshnrdtya"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="text-sm"
              >
                GitHub Profile (@zshnrdtya)
              </MagnetButton>
            </div>

            {/* Metadata Lokasi */}
            <p className="mt-8 font-mono text-xs text-[#64748B]">
              Berdomisili di Kota Depok, Jawa Barat, Indonesia (GMT+7)
            </p>
          </div>
        </TiltedCard>
      </div>
    </section>
  );
}
