'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface AboutPhotoSliderProps {
  photos?: string[];
  alt?: string;
}

const DEFAULT_PHOTO = '/foto-raditya/raditya.jpeg';
const ROTATION_INTERVAL_MS = 3000;

export function AboutPhotoSlider({ photos, alt = 'Raditya Rai Zeeshan' }: AboutPhotoSliderProps) {
  const validPhotos = useMemo(() => {
    if (!photos || photos.length === 0) return [DEFAULT_PHOTO];
    const filtered = photos.filter((p) => typeof p === 'string' && p.trim().length > 0);
    return filtered.length > 0 ? filtered : [DEFAULT_PHOTO];
  }, [photos]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeIndex = currentIndex < validPhotos.length ? currentIndex : 0;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validPhotos.length);
  }, [validPhotos.length]);

  useEffect(() => {
    if (validPhotos.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [validPhotos.length, isHovered, nextSlide]);

  return (
    <div
      className="relative w-full aspect-[4/5] max-w-sm sm:max-w-md lg:max-w-none mx-auto rounded-3xl overflow-hidden shadow-[var(--shadow-neu-out)] mb-10 p-3 bg-[var(--color-surface)] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Galeri Foto Profil Raditya"
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)]">
        {validPhotos.map((photoUrl, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={`${photoUrl}-${idx}`}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <Image
                src={photoUrl}
                alt={`${alt} (Foto ${idx + 1})`}
                fill
                priority={idx === 0}
                unoptimized={photoUrl.startsWith('data:')}
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          );
        })}

        {/* Indikator Titik Interaktif (Hanya jika foto > 1) */}
        {validPhotos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-2 pointer-events-auto">
            <div className="bg-surface/80 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-neu-out flex items-center gap-1.5">
              {validPhotos.map((_, dotIdx) => {
                const isSelected = dotIdx === activeIndex;
                return (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'w-6 bg-accent'
                        : 'w-2 bg-textMain/30 hover:bg-textMain/60'
                    }`}
                    aria-label={`Lihat foto ${dotIdx + 1} dari ${validPhotos.length}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
