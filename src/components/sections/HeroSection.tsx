"use client";

import React from "react";
import DecryptedText from "@/components/primitives/DecryptedText";
import MagnetButton from "@/components/primitives/MagnetButton";

/**
 * HeroSection — Spatial command center dengan tipografi terdekripsi & CTA magnetik.
 * Mengikuti standar antislop-copywriting (100% fakta DATA_RADITYA.md) & antislop-ui.
 */
export default function HeroSection() {
  return (
    <section
      aria-label="Pengenalan Profil"
      className="relative flex min-h-[90vh] flex-col justify-center px-4 pt-28 pb-16 sm:px-6 md:pt-36"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#1E2433] bg-[#11141B] px-3.5 py-1.5 text-xs text-[#94A3B8]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F59B] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F59B]" />
          </span>
          <span className="font-mono">Tersedia untuk Freelance & Kolaborasi</span>
        </div>

        {/* Headline Name */}
        <div className="space-y-2">
          <p className="font-mono text-sm tracking-wider text-[#00F59B]">
            Halo, saya
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F1F5F9] sm:text-6xl md:text-7xl">
            Raditya Rai Zeeshan
          </h1>
        </div>

        {/* Animated Dynamic Role */}
        <div className="flex flex-wrap items-center gap-2 text-xl font-medium text-[#94A3B8] sm:text-2xl md:text-3xl">
          <span>Menekuni peran</span>
          <span className="text-[#00F59B]">
            <DecryptedText
              text="Fullstack Developer & Founder Z - Project"
              speed={30}
            />
          </span>
        </div>

        {/* Factual Subtitle based on DATA_RADITYA.md */}
        <p className="max-w-2xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
          Siswa Rekayasa Perangkat Lunak (PPLG) di SMKN 1 Depok dengan fokus pada
          rekayasa aplikasi web modern, performa tinggi, dan struktur kode yang
          bersih. Berpengalaman memimpin inisiatif digital di Z - Project dan
          menyelesaikan implementasi web di lingkungan industri.
        </p>

        {/* Magnetic CTAs */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <MagnetButton href="#projects" variant="primary">
            <span>Eksplorasi Proyek</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </MagnetButton>

          <MagnetButton href="#contact" variant="secondary">
            <span>Hubungi Saya</span>
          </MagnetButton>
        </div>
      </div>
    </section>
  );
}
