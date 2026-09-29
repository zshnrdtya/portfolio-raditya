"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { useIntro } from "../IntroProvider";

export default function ReplayIntroButton() {
  const { replayIntro, introStatus } = useIntro();

  // Only show when the intro is completed or skipped
  if (introStatus !== "done" && introStatus !== "skipped") {
    return null;
  }

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={replayIntro}
        className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C6E0D2] shadow-[8px_8px_16px_rgba(150,175,161,0.7),-8px_-8px_16px_rgba(255,255,255,0.9)] hover:shadow-[inset_6px_6px_12px_rgba(150,175,161,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] active:scale-95 transition-all text-xs sm:text-sm font-poppins font-bold text-[#284435] hover:text-[#136846] border border-white/50 cursor-pointer select-none"
        title="Putar ulang 3D Interactive Intro"
        aria-label="Ulangi 3D Intro"
      >
        <div className="w-6 h-6 rounded-full bg-[#C6E0D2] shadow-[inset_2px_2px_4px_rgba(150,175,161,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#136846] group-hover:rotate-[-45deg] transition-transform">
          <RotateCcw className="w-3.5 h-3.5" />
        </div>
        <span>Ulangi 3D Intro</span>
      </button>
    </div>
  );
}
