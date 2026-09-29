"use client";

import React, { useRef } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DPadProps {
  onDirectionChange: (x: number, z: number) => void;
}

export default function DPad({ onDirectionChange }: DPadProps) {
  const activeKeys = useRef<{ [key: string]: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const update = () => {
    let x = 0;
    let z = 0;
    if (activeKeys.current.up) z -= 1;
    if (activeKeys.current.down) z += 1;
    if (activeKeys.current.left) x -= 1;
    if (activeKeys.current.right) x += 1;

    onDirectionChange(x, z);
  };

  const handlePress = (dir: "up" | "down" | "left" | "right") => {
    activeKeys.current[dir] = true;
    update();
  };

  const handleRelease = (dir: "up" | "down" | "left" | "right") => {
    activeKeys.current[dir] = false;
    update();
  };

  return (
    <div
      className="fixed bottom-8 left-8 z-40 select-none touch-none md:hidden"
      style={{ touchAction: "none" }}
    >
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Subtle center circle */}
        <div className="w-12 h-12 rounded-full bg-[#C6E0D2] shadow-[inset_3px_3px_6px_rgba(150,175,161,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]" />

        {/* UP Button */}
        <button
          type="button"
          onTouchStart={() => handlePress("up")}
          onTouchEnd={() => handleRelease("up")}
          onTouchCancel={() => handleRelease("up")}
          onMouseDown={() => handlePress("up")}
          onMouseUp={() => handleRelease("up")}
          onMouseLeave={() => handleRelease("up")}
          aria-label="Jalan ke Depan"
          className="absolute top-0 w-11 h-11 rounded-2xl bg-[#C6E0D2] shadow-[4px_4px_10px_rgba(150,175,161,0.8),-4px_-4px_10px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_6px_rgba(150,175,161,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#284435] border border-white/30 cursor-pointer"
        >
          <ChevronUp className="w-6 h-6 text-[#136846]" />
        </button>

        {/* DOWN Button */}
        <button
          type="button"
          onTouchStart={() => handlePress("down")}
          onTouchEnd={() => handleRelease("down")}
          onTouchCancel={() => handleRelease("down")}
          onMouseDown={() => handlePress("down")}
          onMouseUp={() => handleRelease("down")}
          onMouseLeave={() => handleRelease("down")}
          aria-label="Jalan Mundur"
          className="absolute bottom-0 w-11 h-11 rounded-2xl bg-[#C6E0D2] shadow-[4px_4px_10px_rgba(150,175,161,0.8),-4px_-4px_10px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_6px_rgba(150,175,161,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#284435] border border-white/30 cursor-pointer"
        >
          <ChevronDown className="w-6 h-6 text-[#136846]" />
        </button>

        {/* LEFT Button */}
        <button
          type="button"
          onTouchStart={() => handlePress("left")}
          onTouchEnd={() => handleRelease("left")}
          onTouchCancel={() => handleRelease("left")}
          onMouseDown={() => handlePress("left")}
          onMouseUp={() => handleRelease("left")}
          onMouseLeave={() => handleRelease("left")}
          aria-label="Jalan ke Kiri"
          className="absolute left-0 w-11 h-11 rounded-2xl bg-[#C6E0D2] shadow-[4px_4px_10px_rgba(150,175,161,0.8),-4px_-4px_10px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_6px_rgba(150,175,161,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#284435] border border-white/30 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-[#136846]" />
        </button>

        {/* RIGHT Button */}
        <button
          type="button"
          onTouchStart={() => handlePress("right")}
          onTouchEnd={() => handleRelease("right")}
          onTouchCancel={() => handleRelease("right")}
          onMouseDown={() => handlePress("right")}
          onMouseUp={() => handleRelease("right")}
          onMouseLeave={() => handleRelease("right")}
          aria-label="Jalan ke Kanan"
          className="absolute right-0 w-11 h-11 rounded-2xl bg-[#C6E0D2] shadow-[4px_4px_10px_rgba(150,175,161,0.8),-4px_-4px_10px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_6px_rgba(150,175,161,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#284435] border border-white/30 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-[#136846]" />
        </button>
      </div>
    </div>
  );
}
