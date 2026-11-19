'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Check, Trash2, Plus, Star } from 'lucide-react';
import { AboutContent } from '@/lib/siteContent';
import { ImageCropperModal } from '../ImageCropperModal';

interface AboutEditFormProps {
  initialData: AboutContent;
  onSave: (data: AboutContent) => Promise<void>;
  onClose: () => void;
}

const DEFAULT_PHOTO = '/foto-raditya/raditya.jpeg';

export function AboutEditForm({ initialData, onSave, onClose }: AboutEditFormProps) {
  const [heading, setHeading] = useState(initialData.heading || 'About Me');
  const [bioParagraph1, setBioParagraph1] = useState(initialData.bioParagraph1 || '');
  const [bioParagraph2, setBioParagraph2] = useState(initialData.bioParagraph2 || '');
  const [bioParagraph3, setBioParagraph3] = useState(initialData.bioParagraph3 || '');
  const [photos, setPhotos] = useState<string[]>(
    initialData.photos && initialData.photos.length > 0
      ? initialData.photos
      : [DEFAULT_PHOTO]
  );

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file foto maksimal 5MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageSrc(objectUrl);
    setIsCropperOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseCropper = () => {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
    }
    setCropImageSrc(null);
    setIsCropperOpen(false);
  };

  const handleCropComplete = async (blob: Blob) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', blob, 'profile-crop.jpg');
      formData.append('folder', 'about');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto.');
      }

      setPhotos((prev) => [...prev, data.url]);
      handleCloseCropper();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    if (photos.length <= 1) {
      setError('Minimal harus ada 1 foto profil aktif.');
      return;
    }
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    setPhotos((prev) => {
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [target, ...rest];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioParagraph1.trim()) {
      setError('Paragraf bio pertama wajib diisi.');
      return;
    }

    if (photos.length === 0) {
      setError('Minimal harus ada 1 foto profil.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        heading: heading.trim(),
        bioParagraph1: bioParagraph1.trim(),
        bioParagraph2: bioParagraph2.trim(),
        bioParagraph3: bioParagraph3.trim(),
        photos,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-100 text-red-900 text-xs font-semibold border border-red-300">
            {error}
          </div>
        )}

        {/* Galeri Foto Profil */}
        <div className="p-4 rounded-2xl bg-surface shadow-neu-in space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block font-space-grotesk font-bold text-xs uppercase tracking-wider text-textMain">
                Galeri Foto Profil (Rotasi Otomatis 3 Detik)
              </label>
              <p className="text-[11px] text-textMain/70 font-space-grotesk">
                Total: {photos.length} foto. Foto pertama adalah foto utama.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSubmitting}
              className="px-3 py-1.5 rounded-full bg-accent text-white font-space-grotesk font-bold text-xs shadow-neu-out hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              <span>Tambah Foto</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Daftar Thumbnail Foto */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {photos.map((photoUrl, idx) => (
              <div
                key={`${photoUrl}-${idx}`}
                className="relative group rounded-xl overflow-hidden aspect-square bg-surface shadow-neu-out border border-textMain/10"
              >
                <Image
                  src={photoUrl}
                  alt={`Foto Profil ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      title="Jadikan Foto Utama"
                      className="w-7 h-7 rounded-full bg-surface shadow-neu-out text-accent flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star size={12} />
                    </button>
                  )}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      title="Hapus Foto"
                      className="w-7 h-7 rounded-full bg-surface shadow-neu-out text-red-600 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-accent text-white font-space-grotesk text-[9px] font-bold shadow-xs">
                    Utama
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-space-grotesk font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Judul Section
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="About Me"
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-space-grotesk text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <div>
          <label className="block font-space-grotesk font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Bio Paragraf 1 (Perkenalan & Usia) <span className="text-red-700">*</span>
          </label>
          <textarea
            rows={3}
            value={bioParagraph1}
            onChange={(e) => setBioParagraph1(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-space-grotesk text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
          />
        </div>

        <div>
          <label className="block font-space-grotesk font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Bio Paragraf 2 (Keahlian & Pengalaman)
          </label>
          <textarea
            rows={3}
            value={bioParagraph2}
            onChange={(e) => setBioParagraph2(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-space-grotesk text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
          />
        </div>

        <div>
          <label className="block font-space-grotesk font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Bio Paragraf 3 (Filosofi & Mindset)
          </label>
          <textarea
            rows={3}
            value={bioParagraph3}
            onChange={(e) => setBioParagraph3(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-space-grotesk text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-textMain/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploading}
            className="min-h-[44px] px-5 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="min-h-[44px] px-6 py-2 rounded-full bg-accent text-white font-space-grotesk font-bold text-xs shadow-neu-out hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Cropper Interaktif */}
      {isCropperOpen && cropImageSrc && (
        <ImageCropperModal
          key={cropImageSrc}
          isOpen={isCropperOpen}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onClose={handleCloseCropper}
          aspectRatio={4 / 5}
        />
      )}
    </>
  );
}
