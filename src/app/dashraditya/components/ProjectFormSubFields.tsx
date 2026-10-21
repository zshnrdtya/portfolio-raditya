'use client';

import React from 'react';
import Image from 'next/image';
import { X, Upload, Loader2, Link as LinkIcon, Plus } from 'lucide-react';
import type { FormState, FormHandlers } from './ProjectFormFields';

// ─── TechStackField ───────────────────────────────────────────────────────────

const COMMON_TAGS = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Laravel', 'MySQL', 'PostgreSQL', 'Vite',
  'Three.js', 'Alpine.js', 'PHP', 'Blender',
];

interface TechStackFieldProps {
  techStack: string[];
  tagInput: string;
  setTagInput: (v: string) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
}

export const TechStackField: React.FC<TechStackFieldProps> = ({
  techStack, tagInput, setTagInput, handleAddTag, handleRemoveTag,
}) => (
  <div>
    <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-2">
      Tech Stack
    </label>
    <div className="flex gap-2 mb-2.5">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); } }}
        placeholder="Ketik teknologi lalu tekan Enter (cth: Next.js)"
        className="flex-grow px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
      />
      <button type="button" onClick={() => handleAddTag(tagInput)}
        className="px-4 py-2.5 rounded-2xl bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
        <Plus size={14} /><span>Tambah</span>
      </button>
    </div>

    {techStack.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 rounded-xl bg-surface shadow-neu-in">
        {techStack.map((tech) => (
          <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface text-accent text-xs font-bold shadow-neu-out">
            {tech}
            <button type="button" onClick={() => handleRemoveTag(tech)}
              className="hover:text-red-700 transition-colors" aria-label={`Hapus tag ${tech}`}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    )}

    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-bold text-textMain/60 mr-1">Rekomendasi:</span>
      {COMMON_TAGS.filter((t) => !techStack.includes(t)).slice(0, 6).map((preset) => (
        <button key={preset} type="button" onClick={() => handleAddTag(preset)}
          className="px-2 py-0.5 text-[11px] rounded-md bg-surface text-textMain/80 shadow-neu-out hover:shadow-neu-in font-medium transition-all cursor-pointer">
          + {preset}
        </button>
      ))}
    </div>
  </div>
);

// ─── ImageField ───────────────────────────────────────────────────────────────

type ImageFieldProps = Pick<FormState, 'image' | 'imageInputMode' | 'isUploading' | 'fileInputRef'> & {
  previewImageSrc: string | null;
  setImage: (v: string) => void;
  setImageInputMode: (v: 'upload' | 'url') => void;
  handleFileUpload: FormHandlers['handleFileUpload'];
};

export const ImageField: React.FC<ImageFieldProps> = ({
  image, imageInputMode, isUploading, previewImageSrc,
  fileInputRef, setImage, setImageInputMode, handleFileUpload,
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="font-poppins font-bold text-xs uppercase tracking-wider text-textMain">
        Foto Proyek <span className="text-red-700">*</span>
      </label>
      <div className="flex items-center gap-1 text-[11px] font-semibold text-textMain">
        {(['upload', 'url'] as const).map((mode) => (
          <button key={mode} type="button" onClick={() => setImageInputMode(mode)}
            className={`px-2.5 py-1 rounded-md transition-all ${imageInputMode === mode ? 'bg-surface shadow-neu-in text-accent font-bold' : 'text-textMain/70 hover:text-textMain'}`}>
            {mode === 'upload' ? 'Unggah File' : 'Tautan URL'}
          </button>
        ))}
      </div>
    </div>

    {imageInputMode === 'upload' ? (
      <div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload}
          accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" id="project-image-file" />
        <label htmlFor="project-image-file"
          className="border-2 border-dashed border-textMain/25 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-surface hover:bg-textMain/5 transition-all text-center">
          {isUploading ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-accent py-2">
              <Loader2 size={18} className="animate-spin" /><span>Mengunggah foto...</span>
            </div>
          ) : (
            <div className="py-2">
              <Upload size={22} className="mx-auto text-accent mb-1.5" />
              <p className="font-poppins font-bold text-xs text-textMain">Klik untuk memilih foto proyek</p>
              <p className="font-inter text-[11px] text-textMain/70 mt-0.5">PNG, JPG, WebP, atau SVG (maksimal 5MB)</p>
            </div>
          )}
        </label>
      </div>
    ) : (
      <div className="relative">
        <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMain/60" />
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/project-image.webp"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all" />
      </div>
    )}

    {previewImageSrc && (
      <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden shadow-neu-in p-1 bg-surface">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-textMain/5">
          <Image src={previewImageSrc} alt="Preview Proyek" fill className="object-cover" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-surface text-textMain text-[11px] font-bold shadow-neu-out">
          File: {image}
        </div>
      </div>
    )}
  </div>
);
