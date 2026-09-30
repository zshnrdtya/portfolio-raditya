"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface DPadProps {
  onDirectionChange: (x: number, z: number) => void;
}

const MAX_RADIUS = 36;
const DEADZONE = 4;

export default function DPad({ onDirectionChange }: DPadProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activePointerId = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  // Normalize and emit movement vector
  const processPointerPosition = useCallback(
    (dx: number, dy: number) => {
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(distance, MAX_RADIUS);

      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;
      setKnobOffset({ x: knobX, y: knobY });

      if (distance < DEADZONE) {
        onDirectionChange(0, 0);
        return;
      }

      // Normalized coordinates: x from -1 (left) to 1 (right), z from -1 (forward) to 1 (backward)
      const normX = Number((knobX / MAX_RADIUS).toFixed(3));
      const normZ = Number((knobY / MAX_RADIUS).toFixed(3));
      onDirectionChange(normX, normZ);
    },
    [onDirectionChange]
  );

  const resetJoystick = useCallback(() => {
    activePointerId.current = null;
    setIsInteracting(false);
    setKnobOffset({ x: 0, y: 0 });
    onDirectionChange(0, 0);
  }, [onDirectionChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== null) return;
    activePointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsInteracting(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    processPointerPosition(e.clientX - centerX, e.clientY - centerY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    processPointerPosition(e.clientX - centerX, e.clientY - centerY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetJoystick();
  };

  // Reset movement vector when unmounting
  useEffect(() => {
    return () => {
      onDirectionChange(0, 0);
    };
  }, [onDirectionChange]);

  return (
    <div
      className="fixed bottom-6 left-6 sm:bottom-10 sm:left-10 z-40 select-none touch-none md:hidden pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
      style={{ touchAction: "none" }}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        role="group"
        aria-label="Joystick navigasi karakter"
        className="relative w-32 h-32 rounded-full bg-[#C6E0D2] shadow-[inset_5px_5px_10px_rgba(150,175,161,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] border border-white/40 flex items-center justify-center cursor-pointer active:cursor-grabbing"
      >
        {/* Cardinal direction indicators */}
        <span className="absolute top-2.5 w-1.5 h-1.5 rounded-full bg-[#136846]/35 pointer-events-none" />
        <span className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#136846]/35 pointer-events-none" />
        <span className="absolute left-2.5 w-1.5 h-1.5 rounded-full bg-[#136846]/35 pointer-events-none" />
        <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-[#136846]/35 pointer-events-none" />

        {/* Subdued inner boundary ring */}
        <div className="w-20 h-20 rounded-full border border-[#136846]/10 pointer-events-none" />

        {/* Movable thumbstick knob */}
        <div
          className={`absolute w-14 h-14 rounded-full bg-[#C6E0D2] border border-white/60 flex items-center justify-center pointer-events-none select-none will-change-transform ${
            isInteracting
              ? "shadow-[2px_2px_6px_rgba(150,175,161,0.9),-2px_-2px_6px_rgba(255,255,255,1)] ring-2 ring-[#136846]/25"
              : "shadow-[5px_5px_12px_rgba(150,175,161,0.85),-5px_-5px_12px_rgba(255,255,255,0.95)]"
          }`}
          style={{
            transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
            transition: isInteracting
              ? "none"
              : "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Subtle recessed center dimple */}
          <div className="w-5 h-5 rounded-full bg-[#C6E0D2] shadow-[inset_2px_2px_4px_rgba(150,175,161,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#136846]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
