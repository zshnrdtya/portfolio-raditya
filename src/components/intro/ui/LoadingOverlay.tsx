"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#C6E0D2] transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#C6E0D2] shadow-[8px_8px_16px_rgba(150,175,161,0.8),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#136846] animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-poppins font-bold text-sm text-[#284435] tracking-wide">
            Memuat Dunia 3D...
          </p>
          <p className="font-inter text-xs text-[#284435]/60 mt-1">
            Menyiapkan perjalanan ke rumah
          </p>
        </div>
      </div>
    </div>
  );
}
