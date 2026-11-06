"use client";

import React from "react";
import TiltedCard from "@/components/primitives/TiltedCard";
import MagnetButton from "@/components/primitives/MagnetButton";

interface ProjectItem {
  title: string;
  category: string;
  description: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    title: "Zeera AI (Conversational Intelligence)",
    category: "AI Web Application",
    description:
      "Antarmuka asisten AI interaktif dengan respon real-time berbasis Google Gemini AI SDK. Dilengkapi kemampuan streaming teks dan optimasi tata letak perangkat seluler.",
    tech: ["Vite", "TypeScript", "Tailwind CSS", "Gemini API"],
    repoUrl: "https://github.com/zshnrdtya",
    demoUrl: "https://zeeraai.radityarz.my.id/",
  },
  {
    title: "FutsalHub (Sistem Booking & Manajemen)",
    category: "Fullstack Management System",
    description:
      "Platform reservasi lapangan futsal terintegrasi kalender ketersediaan real-time, pencatatan durasi sewa otomatis, serta alur transaksi penyewaan yang transparan.",
    tech: ["Laravel", "Alpine.js", "MySQL", "Tailwind CSS"],
    repoUrl: "https://github.com/zshnrdtya",
  },
  {
    title: "Website Operasional Service Bengkel",
    category: "Web Operations System",
    description:
      "Sistem digitalisasi alur kerja bengkel kendaraan: penjadwalan antrean servis pelanggan, pencatatan riwayat perawatan berkala mesin, dan kontrol inventaris suku cadang.",
    tech: ["Laravel", "Tailwind CSS", "MySQL"],
    repoUrl: "https://github.com/zshnrdtya",
  },
  {
    title: "Kredivo Web Interface Clone",
    category: "Frontend UI/UX Study",
    description:
      "Studi replika antarmuka website fintech berskala besar yang menguji akurasi hierarki visual, micro-interactions, dan ketahanan tata letak multi-perangkat.",
    tech: ["Next.js", "React", "Tailwind CSS"],
    repoUrl: "https://github.com/zshnrdtya",
  },
];

/**
 * ProjectsSection — Showcase proyek unggulan dengan kartu spasial 3D perspektif.
 * Mengikuti standar antislop-ui (R-14: variasi & hierarki kartu) & antislop-copywriting.
 */
export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-label="Katalog Karya Proyek"
      className="relative z-10 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest text-[#00F59B] uppercase">
            Katalog Rekayasa & Karya
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-4xl">
            Proyek Pilihan
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#94A3B8]">
            Setiap karya dirancang dengan perhatian pada arsitektur kode bersih,
            kebutuhan pengguna nyata, dan performa tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS_DATA.map((project) => (
            <TiltedCard
              key={project.title}
              maxTilt={7}
              className="flex flex-col justify-between p-6 sm:p-8"
            >
              <div>
                {/* Category Pill */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-[#00F59B]">
                    {project.category}
                  </span>
                  {project.demoUrl && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00F59B]/30 bg-[#00F59B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#00F59B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00F59B]" />
                      Live Demo
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-bold text-[#F1F5F9] sm:text-2xl">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((techItem) => (
                    <span
                      key={techItem}
                      className="rounded-md border border-[#1E2433] bg-[#08090C] px-2.5 py-1 font-mono text-xs text-[#F1F5F9]"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-8 flex items-center gap-3 border-t border-[#1E2433] pt-5">
                {project.demoUrl && (
                  <MagnetButton
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="text-xs"
                  >
                    Buka Aplikasi
                  </MagnetButton>
                )}
                <MagnetButton
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="text-xs"
                >
                  GitHub Repository
                </MagnetButton>
              </div>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
