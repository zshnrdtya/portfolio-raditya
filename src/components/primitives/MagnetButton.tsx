"use client";

import React, { useRef, useState } from "react";

interface MagnetButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  magneticPull?: number;
  variant?: "primary" | "secondary" | "outline";
  target?: string;
  rel?: string;
  download?: boolean | string;
}

/**
 * MagnetButton — Tombol magnetik spasial dengan interaktivitas taktil.
 * Mengikuti standar antislop-human (keyboard operable, WCAG AA focus ring) & antislop-logic (<120 baris).
 */
export default function MagnetButton({
  children,
  href,
  onClick,
  className = "",
  magneticPull = 0.35,
  variant = "primary",
  target,
  rel,
  download,
}: MagnetButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const shouldDisableMagnet = () => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldDisableMagnet() || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    setPosition({
      x: dx * magneticPull,
      y: dy * magneticPull,
    });
  };

  const handleMouseLeave = () => {
    if (shouldDisableMagnet()) return;
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      "bg-[#00F59B] text-[#08090C] font-semibold hover:bg-[#10B981] shadow-sm active:scale-95",
    secondary:
      "bg-[#151922] text-[#F1F5F9] border border-[#1E2433] hover:border-[#2E384D] hover:bg-[#1E2433]",
    outline:
      "border border-[#00F59B]/40 text-[#00F59B] hover:border-[#00F59B] hover:bg-[#00F59B]/10",
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F59B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] cursor-pointer";

  const transformStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition:
      position.x === 0 && position.y === 0
        ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
        : "transform 0.1s ease-out",
  };

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        download={download}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={transformStyle}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
