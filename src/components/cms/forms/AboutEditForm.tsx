'use client';

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { AboutContent } from '@/lib/siteContent';

interface AboutEditFormProps {
  initialData: AboutContent;
  onSave: (data: AboutContent) => Promise<void>;
  onClose: () => void;
}

export function AboutEditForm({ initialData, onSave, onClose }: AboutEditFormProps) {
  const [heading, setHeading] = useState(initialData.heading || 'About Me');
  const [bioParagraph1, setBioParagraph1] = useState(initialData.bioParagraph1 || '');
  const [bioParagraph2, setBioParagraph2] = useState(initialData.bioParagraph2 || '');
  const [bioParagraph3, setBioParagraph3] = useState(initialData.bioParagraph3 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioParagraph1.trim()) {
      setError('Paragraf bio pertama wajib diisi.');
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
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-900 text-xs font-semibold border border-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Judul Section
        </label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="About Me"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Bio Paragraf 1 (Perkenalan & Usia) <span className="text-red-700">*</span>
        </label>
        <textarea
          rows={3}
          value={bioParagraph1}
          onChange={(e) => setBioParagraph1(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Bio Paragraf 2 (Keahlian & Pengalaman Z - Project)
        </label>
        <textarea
          rows={3}
          value={bioParagraph2}
          onChange={(e) => setBioParagraph2(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Bio Paragraf 3 (Filosofi & Mindset)
        </label>
        <textarea
          rows={3}
          value={bioParagraph3}
          onChange={(e) => setBioParagraph3(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-textMain/10">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="min-h-[44px] px-5 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs transition-all cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] px-6 py-2 rounded-full bg-accent text-white font-poppins font-bold text-xs shadow-neu-out hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
  );
}
