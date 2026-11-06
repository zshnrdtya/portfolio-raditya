"use client";

import React from "react";
import TiltedCard from "@/components/primitives/TiltedCard";

interface TechGroup {
  domain: string;
  items: { name: string; desc: string }[];
}

const TECH_GROUPS: TechGroup[] = [
  {
    domain: "Bahasa Pemrograman & Runtime",
    items: [
      { name: "TypeScript", desc: "Pengetikan statis ketat & generic types" },
      { name: "JavaScript", desc: "ES6+, Async I/O, event-driven" },
      { name: "PHP", desc: "PHP 8.x modern dengan ekosistem Laravel" },
      { name: "Kotlin", desc: "Pengembangan aplikasi Android modern" },
      { name: "Node.js", desc: "Server runtime & API backend" },
      { name: "HTML5 & CSS3", desc: "Aksesibilitas semantik WCAG & layout presisi" },
    ],
  },
  {
    domain: "Frontend & Desain Spasial",
    items: [
      { name: "Next.js", desc: "App Router, SSR, SSG, Server Actions" },
      { name: "React 19", desc: "Server Components & modern hooks" },
      { name: "Tailwind CSS", desc: "Utility-first design tokens & v4 engine" },
      { name: "Three.js & Canvas", desc: "Render 3D spasial & interaktivitas taktil" },
      { name: "Framer Motion", desc: "Orkestrasi fisika animasi deklaratif" },
    ],
  },
  {
    domain: "Backend, Database & Keamanan",
    items: [
      { name: "Laravel", desc: "Arsitektur MVC, Eloquent ORM, API resource" },
      { name: "PostgreSQL & Supabase", desc: "Relational schema & connection pooling" },
      { name: "MySQL", desc: "Query optimization & relational data store" },
      { name: "Prisma ORM", desc: "Data modeling tipe-aman & database migrations" },
      { name: "WebAuthn / Passkeys", desc: "Autentikasi biometrik FIDO2 tanpa password" },
      { name: "Google Gemini AI", desc: "Implementasi LLM SDK & streaming percakapan" },
    ],
  },
];

/**
 * TechSection — Ekosistem keahlian teknis terstruktur dari DATA_RADITYA.md.
 * Mengikuti standar antislop-ui (R-14: pengelompokan bernalar) & antislop-human.
 */
export default function TechSection() {
  return (
    <section
      id="skills"
      aria-label="Keahlian dan Ekosistem Teknologi"
      className="relative z-10 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest text-[#00F59B] uppercase">
            Arsenal Teknologi
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-4xl">
            Alat & Ekosistem Rekayasa
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#94A3B8]">
            Kombinasi teknologi yang dipilih secara pragmatis untuk menghasilkan
            aplikasi yang tangguh, cepat, dan mudah dirawat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TECH_GROUPS.map((group) => (
            <TiltedCard
              key={group.domain}
              maxTilt={5}
              className="p-6 sm:p-7"
            >
              <h3 className="font-mono text-sm font-bold tracking-wide text-[#00F59B] uppercase">
                {group.domain}
              </h3>

              <ul className="mt-6 space-y-4">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-col border-b border-[#1E2433]/70 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-[#F1F5F9]">
                      {item.name}
                    </span>
                    <span className="mt-1 text-xs text-[#94A3B8]">
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
