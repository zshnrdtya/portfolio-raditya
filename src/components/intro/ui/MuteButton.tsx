"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MuteButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

export default function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C6E0D2] shadow-[6px_6px_14px_rgba(150,175,161,0.8),-6px_-6px_14px_rgba(255,255,255,0.9)] hover:shadow-[inset_4px_4px_8px_rgba(150,175,161,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] active:scale-95 transition-all text-[#284435] border border-white/40 cursor-pointer select-none"
      title={isMuted ? "Bunyikan Musik Latar" : "Matikan Suara"}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-[#284435]/70" />
      ) : (
        <Volume2 className="w-4 h-4 text-[#136846]" />
      )}
    </button>
  );
}
