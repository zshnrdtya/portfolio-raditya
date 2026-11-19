'use client';

import React, { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Loader2 } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onCropComplete: (blob: Blob) => Promise<void>;
  onClose: () => void;
  aspectRatio?: number; // width / height, default 4/5 = 0.8
}

const VIEWPORT_WIDTH = 280;
const VIEWPORT_HEIGHT = 350; // 280 / 350 = 4/5

export function ImageCropperModal({
  isOpen,
  imageSrc,
  onCropComplete,
  onClose,
  aspectRatio = 4 / 5,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const dragStartRef = useRef({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const baseScale = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height) return 1;
    return Math.max(VIEWPORT_WIDTH / naturalSize.width, VIEWPORT_HEIGHT / naturalSize.height);
  }, [naturalSize]);

  const currentWidth = naturalSize.width * baseScale * zoom;
  const currentHeight = naturalSize.height * baseScale * zoom;

  const maxOffsetX = Math.max(0, (currentWidth - VIEWPORT_WIDTH) / 2);
  const maxOffsetY = Math.max(0, (currentHeight - VIEWPORT_HEIGHT) / 2);

  // Derivasi offset aman (clamped) langsung saat render tanpa side-effect
  const displayOffset = useMemo(
    () => ({
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y)),
    }),
    [maxOffsetX, maxOffsetY, offset.x, offset.y]
  );

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
  };

  const startDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY, startOffsetX: displayOffset.x, startOffsetY: displayOffset.y };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    setOffset({
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, dragStartRef.current.startOffsetX + dx)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, dragStartRef.current.startOffsetY + dy)),
    });
  };

  const handleApplyCrop = async () => {
    if (!imageRef.current || !naturalSize.width || !naturalSize.height) return;

    setIsProcessing(true);
    try {
      const img = imageRef.current;
      const targetWidth = 800;
      const targetHeight = Math.round(targetWidth / aspectRatio); // 1000px untuk 4:5

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Gagal menyiapkan kanvas gambar.');

      const imgLeft = VIEWPORT_WIDTH / 2 + displayOffset.x - currentWidth / 2;
      const imgTop = VIEWPORT_HEIGHT / 2 + displayOffset.y - currentHeight / 2;

      const cropX = Math.max(0, (-imgLeft / currentWidth) * naturalSize.width);
      const cropY = Math.max(0, (-imgTop / currentHeight) * naturalSize.height);
      const cropW = (VIEWPORT_WIDTH / currentWidth) * naturalSize.width;
      const cropH = (VIEWPORT_HEIGHT / currentHeight) * naturalSize.height;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          await onCropComplete(blob);
          setIsProcessing(false);
        },
        'image/jpeg',
        0.85
      );
    } catch {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-surface rounded-3xl p-5 sm:p-6 shadow-neu-out border border-white/60 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-textMain/10 mb-4">
          <div>
            <span className="font-space-grotesk font-bold text-[10px] uppercase tracking-wider text-accent">
              Sesuaikan Posisi & Ukuran
            </span>
            <h3 className="font-space-grotesk font-black text-base text-textMain">
              Atur Crop Foto (Rasio 4:5)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Viewport Frame */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-neu-in cursor-grab active:cursor-grabbing select-none bg-black/90 flex items-center justify-center"
          style={{ width: `${VIEWPORT_WIDTH}px`, height: `${VIEWPORT_HEIGHT}px` }}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => e.touches.length === 1 && startDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => e.touches.length === 1 && moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop Preview"
            onLoad={handleImageLoad}
            draggable={false}
            className="absolute pointer-events-none transition-transform duration-75 ease-out max-w-none"
            style={{
              width: `${currentWidth}px`,
              height: `${currentHeight}px`,
              transform: `translate(${displayOffset.x}px, ${displayOffset.y}px)`,
            }}
          />

          {/* Grid Panduan */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/40">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white/20 last:border-0" />
            ))}
          </div>
        </div>

        <p className="text-[11px] text-textMain/70 font-space-grotesk mt-2 text-center">
          Geser foto untuk memposisikan wajah. Gunakan slider untuk perbesar.
        </p>

        {/* Zoom Controls */}
        <div className="w-full flex items-center gap-3 px-3 py-2 mt-3 rounded-2xl bg-surface shadow-neu-in">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.15))}
            className="p-1 rounded-full text-textMain/70 hover:text-accent cursor-pointer"
            title="Perkecil"
          >
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-accent)] cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
            className="p-1 rounded-full text-textMain/70 hover:text-accent cursor-pointer"
            title="Perbesar"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="p-1 rounded-full text-textMain/70 hover:text-accent cursor-pointer ml-1"
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-end gap-3 mt-5 pt-3 border-t border-textMain/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-5 py-2 rounded-full bg-accent text-white font-space-grotesk font-bold text-xs shadow-neu-out hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Check size={13} />
                <span>Terapkan Crop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
