"use client";

import React, { useEffect, useRef } from "react";

interface AmbientCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

/**
 * AmbientCanvas — Canvas partikel spasial interaktif 60 FPS terinspirasi ekosistem react-bits.
 * Mengikuti standar antislop-logic (bebas library raksasa, < 180 baris) & antislop-human
 * (otomatis nonaktif saat prefers-reduced-motion aktif, otomatis throttle saat tab tidak terlihat).
 */
export default function AmbientCanvas({ className = "" }: AmbientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Cek preferensi aksesibilitas: reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Kursor spasial interaktif
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    // Responsive particle count: lebih hemat daya pada layar mobile (antislop-layoutmobile)
    const isMobile = window.innerWidth < 768;
    const particleCount = prefersReducedMotion ? 0 : isMobile ? 25 : 55;
    const maxConnectionDistance = isMobile ? 80 : 120;

    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 0.8,
          baseAlpha: Math.random() * 0.35 + 0.2,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    handleResize();

    // Render loop yang efisien dan hemat baterai
    const render = () => {
      if (!isVisible || prefersReducedMotion) return;

      ctx.clearRect(0, 0, width, height);

      // Gambar koneksi antar partikel terdekat
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Update posisi
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Pantulan batas layar
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Interaktivitas magnet kursor
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 0.8;
          p1.x -= (dxMouse / distMouse) * force;
          p1.y -= (dyMouse / distMouse) * force;
        }

        // Gambar titik partikel (warna aksen subtil #00F59B)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 155, ${p1.baseAlpha})`;
        ctx.fill();

        // Hubungkan partikel terdekat dengan garis subtil
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const alpha = (1 - dist / maxConnectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 155, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause animasi saat tab browser tidak aktif untuk menghemat baterai
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60 transition-opacity duration-700 ${className}`}
    />
  );
}
