import React from "react";

/**
 * Footer — Penutup halaman minimalis dan bersih.
 * Mengikuti standar antislop-ui & antislop-human.
 */
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1E2433] bg-[#08090C] px-4 py-8 text-center sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-[#94A3B8]">
          &copy; {new Date().getFullYear()} Raditya Rai Zeeshan. Hak cipta
          dilindungi.
        </p>

        <p className="font-mono text-xs text-[#64748B]">
          Dirancang dengan Next.js App Router & Tailwind CSS v4.
        </p>
      </div>
    </footer>
  );
}
