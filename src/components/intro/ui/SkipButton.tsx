"use client";

import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface SkipButtonProps {
  onSkip: () => void;
}

export default function SkipButton({ onSkip }: SkipButtonProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSkip]);

  return (
    <button
      onClick={onSkip}
      className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-full bg-[#C6E0D2] shadow-[6px_6px_14px_rgba(150,175,161,0.8),-6px_-6px_14px_rgba(255,255,255,0.9)] hover:shadow-[inset_4px_4px_8px_rgba(150,175,161,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#136846]/60 focus-visible:outline-none transition-all text-xs sm:text-sm font-poppins font-semibold text-[#284435] border border-white/40 cursor-pointer select-none"
      title="Lewati intro 3D (Tekan Esc)"
      aria-label="Lewati Intro"
    >
      <span className="hidden sm:inline">Lewati Intro</span>
      <span className="sm:hidden">Lewati</span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#284435]/10 rounded border border-[#284435]/20 text-[#284435]/80">
        Esc
      </kbd>
      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#136846] group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
