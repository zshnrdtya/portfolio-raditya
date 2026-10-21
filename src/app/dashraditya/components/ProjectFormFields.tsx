'use client';

import React from 'react';
import { ProjectItem } from '../types';
import { X, Sparkles, Loader2, Check } from 'lucide-react';
import { TechStackField, ImageField } from './ProjectFormSubFields';

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface FormState {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  tagInput: string;
  demoUrl: string;
  githubUrl: string;
  order: number;
  published: boolean;
  imageInputMode: 'upload' | 'url';
  isUploading: boolean;
  isGeneratingAi: boolean;
  aiLanguage: 'en' | 'id';
  isSubmitting: boolean;
  formError: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface FormHandlers {
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setImage: (v: string) => void;
  setTagInput: (v: string) => void;
  setImageInputMode: (v: 'upload' | 'url') => void;
  setDemoUrl: (v: string) => void;
  setGithubUrl: (v: string) => void;
  setOrder: (v: number) => void;
  setPublished: (v: boolean) => void;
  setAiLanguage: (v: 'en' | 'id') => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateAiDescription: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProjectFormFieldsProps {
  formState: FormState;
  handlers: FormHandlers;
  previewImageSrc: string | null;
  projectToEdit: ProjectItem | null;
  onClose: () => void;
}

export const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({
  formState, handlers, previewImageSrc, projectToEdit,
}) => {
  const {
    title, description, image, techStack, tagInput,
    demoUrl, githubUrl, order, published,
    imageInputMode, isUploading, isGeneratingAi,
    aiLanguage, isSubmitting, formError, fileInputRef,
  } = formState;

  const {
    setTitle, setDescription, setImage, setTagInput, setImageInputMode,
    setDemoUrl, setGithubUrl, setOrder, setPublished, setAiLanguage,
    handleAddTag, handleRemoveTag, handleFileUpload,
    handleGenerateAiDescription, handleSubmit, onClose,
  } = handlers;

  return (
    <div className="relative w-full max-w-2xl bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60 my-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-textMain/10">
        <div>
          <h2 id="modal-project-title" className="font-poppins font-black text-xl sm:text-2xl text-textMain">
            {projectToEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}
          </h2>
          <p className="font-inter text-xs sm:text-sm text-textMain/75 mt-0.5">
            Isi data detail proyek untuk ditampilkan pada section Featured Projects.
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup form modal"
          className="w-10 h-10 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain transition-all cursor-pointer">
          <X size={18} />
        </button>
      </div>

      {formError && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-100/90 text-red-900 text-xs sm:text-sm font-semibold shadow-neu-in border border-red-300">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Judul Proyek */}
        <div>
          <label htmlFor="project-title" className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-2">
            Judul / Nama Proyek <span className="text-red-700">*</span>
          </label>
          <input id="project-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Platform Booking Futsal Real-time"
            className="w-full px-4 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all" required />
        </div>

        {/* Deskripsi & Gemini AI Generator */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label htmlFor="project-description" className="font-poppins font-bold text-xs uppercase tracking-wider text-textMain">
              Deskripsi Proyek <span className="text-red-700">*</span>
            </label>
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <div className="flex items-center rounded-lg bg-surface shadow-neu-in p-0.5 text-[11px] font-semibold text-textMain">
                {(['en', 'id'] as const).map((lang) => (
                  <button key={lang} type="button" onClick={() => setAiLanguage(lang)}
                    className={`px-2 py-0.5 rounded-md transition-all uppercase ${aiLanguage === lang ? 'bg-accent text-white shadow-xs' : 'text-textMain/70 hover:text-textMain'}`}>
                    {lang}
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleGenerateAiDescription}
                disabled={isGeneratingAi || !title.trim()}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-surface text-accent shadow-neu-out hover:shadow-neu-in active:shadow-neu-in disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Generate deskripsi otomatis sesuai aturan antislop copywriting">
                {isGeneratingAi
                  ? (<><Loader2 size={13} className="animate-spin" /><span>Menulis...</span></>)
                  : (<><Sparkles size={13} /><span>Buat dengan Gemini AI</span></>)}
              </button>
            </div>
          </div>
          <textarea id="project-description" rows={3} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi singkat, faktual, dan padat (1-2 kalimat)..."
            className="w-full px-4 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-y" required />
          <p className="font-inter text-[11px] text-textMain/70 mt-1">
            Dipandu aturan antislop: tanpa kata klise AI, tanpa klaim palsu, dan tanpa tanda em dash.
          </p>
        </div>

        <TechStackField techStack={techStack} tagInput={tagInput} setTagInput={setTagInput}
          handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} />

        <ImageField image={image} imageInputMode={imageInputMode} isUploading={isUploading}
          previewImageSrc={previewImageSrc} fileInputRef={fileInputRef}
          setImage={setImage} setImageInputMode={setImageInputMode} handleFileUpload={handleFileUpload} />

        {/* Demo URL & GitHub URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="project-demourl" className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
              Live Demo URL (Opsional)
            </label>
            <input id="project-demourl" type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://zeeraai.radityarz.my.id"
              className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all" />
          </div>
          <div>
            <label htmlFor="project-githuburl" className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
              GitHub Repo (Opsional)
            </label>
            <input id="project-githuburl" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/zshnrdtya/..."
              className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all" />
          </div>
        </div>

        {/* Urutan & Status Publikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="project-order" className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
              Urutan Tampil (Order)
            </label>
            <input id="project-order" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all" />
          </div>
          <div className="flex items-center sm:pt-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded-md accent-[#136846] cursor-pointer" />
              <span className="font-poppins font-bold text-sm text-textMain">Publikasikan ke Website</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-textMain/10">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs transition-all cursor-pointer disabled:opacity-50">
            Batal
          </button>
          <button type="submit" disabled={isSubmitting || isUploading || isGeneratingAi}
            className="min-h-[44px] px-6 py-2.5 rounded-full bg-accent text-white font-poppins font-bold text-xs shadow-neu-out hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting
              ? (<><Loader2 size={14} className="animate-spin" /><span>Menyimpan...</span></>)
              : (<><Check size={14} /><span>{projectToEdit ? 'Simpan Perubahan' : 'Tambahkan Proyek'}</span></>)}
          </button>
        </div>
      </form>
    </div>
  );
};
