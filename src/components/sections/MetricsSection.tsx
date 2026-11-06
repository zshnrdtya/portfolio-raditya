"use client";

import React from "react";
import TiltedCard from "@/components/primitives/TiltedCard";

interface MetricItem {
  value: string;
  label: string;
  detail: string;
}

const METRICS_DATA: MetricItem[] = [
  {
    value: "2+ Tahun",
    label: "Pengalaman Praktis",
    detail: "Eksplorasi intensif rekayasa web modern, algoritma, dan arsitektur database.",
  },
  {
    value: "10+ Proyek",
    label: "Proyek Selesai",
    detail: "Aplikasi web produksi, sistem reservasi, platform kasir, dan integrasi AI.",
  },
  {
    value: "1 PKL Industri",
    label: "Pengalaman Industri",
    detail: "Fullstack Developer Intern di Indi Technology (3D scrollytelling & QA).",
  },
  {
    value: "5 Kejuaraan",
    label: "Prestasi Organisasi",
    detail: "Penghargaan kompetisi marching band & drum battle tingkat daerah dan nasional.",
  },
];

/**
 * MetricsSection — Metrik performa dan rekam jejak faktual dari DATA_RADITYA.md.
 * Mengikuti standar antislop-copywriting (C-5: bukti konkret, no empty claims).
 */
export default function MetricsSection() {
  return (
    <section
      id="metrics"
      aria-label="Metrik dan Rekam Jejak"
      className="relative z-10 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest text-[#00F59B] uppercase">
            Rekam Jejak Terverifikasi
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-3xl">
            Metrik & Dampak Kinerja
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS_DATA.map((item) => (
            <TiltedCard
              key={item.label}
              maxTilt={6}
              className="p-6 transition-all"
            >
              <div className="font-mono text-3xl font-extrabold text-[#00F59B]">
                {item.value}
              </div>
              <h3 className="mt-2 text-base font-semibold text-[#F1F5F9]">
                {item.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                {item.detail}
              </p>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
