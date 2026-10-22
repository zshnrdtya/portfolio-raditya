'use client';

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { HeroContent } from '@/lib/siteContent';

interface HeroEditFormProps {
  initialData: HeroContent;
  onSave: (data: HeroContent) => Promise<void>;
  onClose: () => void;
}

export function HeroEditForm({ initialData, onSave, onClose }: HeroEditFormProps) {
  const [greeting, setGreeting] = useState(initialData.greeting || '');
  const [name, setName] = useState(initialData.name || '');
  const [tagline, setTagline] = useState(initialData.tagline || '');
  const [rolesInput, setRolesInput] = useState(initialData.roles ? initialData.roles.join(', ') : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }

    const parsedRoles = rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        greeting: greeting.trim(),
        name: name.trim(),
        tagline: tagline.trim(),
        roles: parsedRoles.length > 0 ? parsedRoles : initialData.roles,
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
          Teks Sapaan Awal
        </label>
        <input
          type="text"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeholder="Hi, I am"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Nama Lengkap <span className="text-red-700">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Raditya Rai Zeeshan"
          required
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Badge / Tagline Posisi
        </label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Founder & Lead Developer at Z - Project"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      <div>
        <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
          Daftar Peran Efek Ketik (Pisahkan dengan koma)
        </label>
        <textarea
          rows={2}
          value={rolesInput}
          onChange={(e) => setRolesInput(e.target.value)}
          placeholder="Fullstack Developer, UI/UX Designer, Founder of Z - Project"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
        />
        <p className="font-inter text-[11px] text-textMain/65 mt-1">
          Contoh: Fullstack Developer, UI/UX Designer, Mobile App Developer
        </p>
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
