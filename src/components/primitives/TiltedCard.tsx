"use client";

import React, { useRef, useState } from "react";

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * TiltedCard — Kartu spasial perspektif 3D dengan responsivitas kursor halus.
 * Mengikuti standar antislop-ui (kedalaman taktil, sudut terbatas) & antislop-layoutmobile
 * (otomatis dinonaktifkan di perangkat sentuh agar scrolling halaman tetap mulus).
 */
export default function TiltedCard({
  children,
  className = "",
  maxTilt = 8,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Helper untuk mendeteksi perangkat sentuh atau prefers-reduced-motion
  const shouldDisableTilt = () => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldDisableTilt() || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
    );

    setGlarePosition({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    if (shouldDisableTilt()) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (shouldDisableTilt()) return;
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || "none",
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className={`relative overflow-hidden rounded-xl border border-[#1E2433] bg-[#11141B] transition-colors hover:border-[#2E384D] ${className}`}
    >
      {/* Glare spotlight lokal yang dinamis saat mouse hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(0, 245, 155, 0.25), transparent 70%)`,
        }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
