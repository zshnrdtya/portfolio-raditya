'use client';

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { ContactContent } from '@/lib/siteContent';

interface ContactEditFormProps {
  initialData: ContactContent;
  onSave: (data: ContactContent) => Promise<void>;
  onClose: () => void;
}

export function ContactEditForm({ initialData, onSave, onClose }: ContactEditFormProps) {
  const [title, setTitle] = useState(initialData.title || 'Get In Touch');
  const [subtitle, setSubtitle] = useState(initialData.subtitle || '');
  const [email, setEmail] = useState(initialData.email || 'radityaraizeeshan@gmail.com');
  const [location, setLocation] = useState(initialData.location || 'Jl. Pekapuran, Gg Ancin RT 04/24');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !email.trim()) {
      setError('Judul dan email wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        subtitle: subtitle.trim(),
        email: email.trim(),
        location: location.trim(),
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
          Judul Section Kontak <span className="text-red-700">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Get In Touch"
          required
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Subjudul / Teks Ajakan Kolaborasi
        </label>
        <textarea
          rows={2}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Have a project in mind or want to collaborate? Feel free to reach out!"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Alamat Email Resmi <span className="text-red-700">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@domain.com"
          required
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Teks Lokasi
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Jl. Pekapuran, Gg Ancin RT 04/24"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
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
