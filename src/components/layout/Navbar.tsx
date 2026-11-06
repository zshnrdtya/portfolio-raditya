"use client";

import React, { useState, useEffect } from "react";
import MagnetButton from "@/components/primitives/MagnetButton";

/**
 * Navbar — Floating spatial navigation bar dengan feedback interaktif.
 * Mengikuti standar antislop-ui (dosis kaca terbatas, kontras WCAG AA) & antislop-layoutmobile.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Metrik", href: "#metrics" },
    { label: "Proyek", href: "#projects" },
    { label: "Tech Stack", href: "#skills" },
    { label: "Pengalaman", href: "#journey" },
    { label: "Kontak", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-300">
      <nav
        aria-label="Navigasi Utama"
        className={`flex w-full max-w-5xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-300 ${
          scrolled
            ? "border-[#1E2433] bg-[#08090C]/85 backdrop-blur-md shadow-lg shadow-black/40"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand Monogram */}
        <a
          href="#"
          className="group flex items-center gap-2.5 font-mono text-sm tracking-wider text-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F59B]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2433] bg-[#11141B] font-bold text-[#00F59B] transition-colors group-hover:border-[#00F59B]/50">
            RZ
          </span>
          <span className="font-semibold">radityarz</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#00F59B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F59B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <MagnetButton
            href="#contact"
            variant="outline"
            className="hidden text-xs md:inline-flex"
          >
            Hubungi Saya
          </MagnetButton>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2433] bg-[#11141B] text-[#F1F5F9] transition-colors hover:border-[#2E384D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F59B] md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-40 rounded-xl border border-[#1E2433] bg-[#08090C]/95 p-6 backdrop-blur-lg md:hidden shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-[#F1F5F9] transition-colors hover:bg-[#11141B] hover:text-[#00F59B]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#00F59B] px-4 py-3 text-sm font-semibold text-[#08090C]"
            >
              Hubungi Saya
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
