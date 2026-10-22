'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';
import { HeroEditForm } from './forms/HeroEditForm';
import { StatisticsEditForm } from './forms/StatisticsEditForm';
import { AboutEditForm } from './forms/AboutEditForm';
import { ContactEditForm } from './forms/ContactEditForm';

export function SectionEditModal() {
  const { editingSection, closeEditModal, content, saveSectionContent } = useSiteContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingSection) {
        closeEditModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingSection, closeEditModal]);

  if (!editingSection) return null;

  const sectionTitles: Record<string, string> = {
    hero: 'Hero Section (Header Beranda)',
    statistics: 'Statistics Section (Statistik Pencapaian)',
    about: 'About Me Section (Biografi & Pengalaman)',
    contact: 'Contact Section (Form & Informasi Kontak)',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inline-cms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeEditModal();
        }
      }}
    >
      <div className="relative w-full max-w-xl bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-textMain/10 mb-5">
          <div>
            <span className="font-poppins font-bold text-[10px] uppercase tracking-wider text-accent">
              Inline CMS Editor
            </span>
            <h2
              id="inline-cms-modal-title"
              className="font-poppins font-black text-lg sm:text-xl text-textMain"
            >
              {sectionTitles[editingSection] || `Edit ${editingSection}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeEditModal}
            aria-label="Tutup form edit"
            className="w-9 h-9 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Form Content */}
        {editingSection === 'hero' && (
          <HeroEditForm
            initialData={content.hero}
            onSave={(data) => saveSectionContent('hero', data)}
            onClose={closeEditModal}
          />
        )}

        {editingSection === 'statistics' && (
          <StatisticsEditForm
            initialData={content.statistics}
            onSave={(data) => saveSectionContent('statistics', data)}
            onClose={closeEditModal}
          />
        )}

        {editingSection === 'about' && (
          <AboutEditForm
            initialData={content.about}
            onSave={(data) => saveSectionContent('about', data)}
            onClose={closeEditModal}
          />
        )}

        {editingSection === 'contact' && (
          <ContactEditForm
            initialData={content.contact}
            onSave={(data) => saveSectionContent('contact', data)}
            onClose={closeEditModal}
          />
        )}
      </div>
    </div>
  );
}
