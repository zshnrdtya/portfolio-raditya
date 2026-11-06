"use client";

import React, { useEffect, useState, useRef } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  characters?: string;
  className?: string;
  trigger?: boolean;
}

const DEFAULT_CHARS = "ABCDEF0123456789_#@<>/~$*";

/**
 * DecryptedText — Animasi dekripsi tipografi cyber terinspirasi react-bits.
 * Mengikuti standar antislop-human (screen-reader ramah via aria-label, no jitter for reduced-motion).
 */
export default function DecryptedText({
  text,
  speed = 35,
  characters = DEFAULT_CHARS,
  className = "",
  trigger = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Abaikan animasi jika pengguna mengaktifkan reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !trigger) {
      return;
    }

    let iteration = 0;
    const targetLength = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      iteration += 1 / 2;

      if (iteration >= targetLength) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, characters, trigger]);

  return (
    <span aria-label={text} className={`inline-block font-mono ${className}`}>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}
