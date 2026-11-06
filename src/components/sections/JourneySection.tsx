"use client";

import React from "react";
import TiltedCard from "@/components/primitives/TiltedCard";

/**
 * JourneySection — Narasi dua pilar kepemimpinan: Rekayasa Software & Disiplin Marching Band.
 * Mengikuti standar antislop-copywriting (C-5: fakta DATA_RADITYA.md, no buzzword slop).
 */
export default function JourneySection() {
  return (
    <section
      id="journey"
      aria-label="Riwayat Pengalaman dan Kepemimpinan"
      className="relative z-10 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest text-[#00F59B] uppercase">
            Jejak Langkah
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-4xl">
            Pengalaman & Kepemimpinan
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#94A3B8]">
            Dua pilar pembentuk karakter: ketepatan logika dalam rekayasa kode
            dan kedisiplinan koordinasi dalam orkestrasi tim nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Pilar 1: Rekayasa Web & Wirausaha */}
          <div className="space-y-6">
            <h3 className="font-mono text-sm font-bold tracking-wider text-[#00F59B] uppercase">
              Pilar Rekayasa Software
            </h3>

            {/* Z - Project */}
            <TiltedCard maxTilt={5} className="p-6 sm:p-7">
              <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                <span>Wirausaha Digital</span>
                <span className="text-[#00F59B]">2023 — Sekarang</span>
              </div>
              <h4 className="mt-2 text-lg font-bold text-[#F1F5F9]">
                Founder & Project Manager | Z - Project
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
                Mendirikan dan mengelola inisiatif jasa dokumen akademik dan
                profesional berstandar tinggi. Memproduksi puluhan karya ilmiah,
                presentasi interaktif, dan resume berstandar Applicant Tracking
                System (ATS).
              </p>
            </TiltedCard>

            {/* Indi Technology */}
            <TiltedCard maxTilt={5} className="p-6 sm:p-7">
              <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                <span>Praktik Kerja Industri (PKL)</span>
                <span className="text-[#00F59B]">2024</span>
              </div>
              <h4 className="mt-2 text-lg font-bold text-[#F1F5F9]">
                FullStack Developer Intern | Indi Technology
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
                Mengembangkan website profil perusahaan dengan fitur interaktif
                3D scrollytelling. Terlibat dalam pengujian sistem (QA) dan alur
                deployment aplikasi ke server produksi.
              </p>
            </TiltedCard>
          </div>

          {/* Pilar 2: Kepemimpinan & Marching Band */}
          <div className="space-y-6">
            <h3 className="font-mono text-sm font-bold tracking-wider text-[#00F59B] uppercase">
              Pilar Kepemimpinan & Disiplin
            </h3>

            {/* Al-Hidayah Marching Band */}
            <TiltedCard maxTilt={5} className="p-6 sm:p-7">
              <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                <span>Kepemimpinan Organisasi</span>
                <span className="text-[#00F59B]">2024 — 2025</span>
              </div>
              <h4 className="mt-2 text-lg font-bold text-[#F1F5F9]">
                Assistant Coach & Head of Equipment | Marching Band
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
                Bertanggung jawab atas logistik instrumen perkusi dan tiup serta
                melatih puluhan anggota dalam sinkronisasi ritme musikal.
                Membawa tim meraih 5 gelar kejuaraan daerah dan nasional
                (Snare Drum Player).
              </p>
            </TiltedCard>

            {/* Filosofi Hidup */}
            <div className="rounded-xl border border-[#1E2433] bg-[#08090C] p-6 sm:p-7">
              <p className="font-mono text-xs text-[#00F59B] uppercase">
                Prinsip Kerja & Pola Pikir
              </p>
              <blockquote className="mt-3 text-sm italic leading-relaxed text-[#F1F5F9]">
                &ldquo;Bukan masalahnya yang rumit; benahi pola pikirnya, maka
                masalah akan menemukan solusinya.&rdquo;
              </blockquote>
              <p className="mt-3 text-xs text-[#94A3B8]">
                — Raditya Rai Zeeshan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
