'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import { SectionKey } from '@/lib/siteContent';
import { useSiteContent } from './SiteContentProvider';

interface SectionEditTriggerProps {
  section: SectionKey;
  label?: string;
}

export function SectionEditTrigger({ section, label }: SectionEditTriggerProps) {
  const { isAdmin, isEditMode, openEditModal } = useSiteContent();

  if (!isAdmin || !isEditMode) return null;

  const displayLabel = label || `Edit Konten ${section.toUpperCase()}`;

  return (
    <div className="flex justify-end mb-4 relative z-30">
      <button
        type="button"
        onClick={() => openEditModal(section)}
        className="min-h-[44px] px-4 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-accent border border-accent/30 font-poppins font-bold text-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 animate-fade-in"
        title={`Ubah isi teks pada section ${section}`}
      >
        <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center">
          <Pencil size={11} className="text-accent" />
        </div>
        <span>{displayLabel}</span>
      </button>
    </div>
  );
}
