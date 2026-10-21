'use client';

import React from 'react';
import Image from 'next/image';
import { ProjectItem } from '../types';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

interface AdminProjectCardProps {
  project: ProjectItem;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
  onTogglePublish: (project: ProjectItem) => void;
  isActionLoading: boolean;
}

export const AdminProjectCard: React.FC<AdminProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onTogglePublish,
  isActionLoading,
}) => {
  const imageSrc = project.image.startsWith('http') || project.image.startsWith('/')
    ? project.image
    : `/foto-project/${project.image}`;

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-neu-out hover:shadow-neu-in transition-all duration-300 flex flex-col justify-between border border-transparent">
      <div>
        {/* Gambar & Status Badges */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-neu-in p-1.5 mb-4 bg-surface">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-textMain/5">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold shadow-neu-out ${
                project.published
                  ? 'bg-surface text-accent'
                  : 'bg-surface text-amber-800'
              }`}
            >
              {project.published ? 'Publik' : 'Draf'}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-surface text-textMain/70 shadow-neu-out">
              Urutan: {project.order}
            </span>
          </div>
        </div>

        {/* Info Proyek */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-poppins font-black text-lg text-textMain leading-snug">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Kunjungi Live Demo"
                aria-label={`Buka demo untuk ${project.title}`}
                className="w-8 h-8 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain hover:text-accent transition-all cursor-pointer"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Lihat Repository GitHub"
                aria-label={`Buka repository GitHub untuk ${project.title}`}
                className="w-8 h-8 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain hover:text-accent transition-all cursor-pointer"
              >
                <GithubIcon size={14} />
              </a>
            )}
          </div>
        </div>

        <p className="font-inter text-xs text-textMain/80 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-[11px] font-bold bg-surface text-accent rounded-lg shadow-neu-out"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-3 border-t border-textMain/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onTogglePublish(project)}
          disabled={isActionLoading}
          aria-label={project.published ? 'Sembunyikan proyek' : 'Publikasikan proyek'}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-neu-out active:shadow-neu-in disabled:opacity-50 ${
            project.published
              ? 'text-amber-800 hover:text-amber-900'
              : 'text-accent hover:text-emerald-900'
          }`}
        >
          {project.published ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{project.published ? 'Jadikan Draf' : 'Tampilkan'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(project)}
            disabled={isActionLoading}
            aria-label={`Edit ${project.title}`}
            className="w-9 h-9 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain hover:text-accent transition-all cursor-pointer disabled:opacity-50"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            disabled={isActionLoading}
            aria-label={`Hapus ${project.title}`}
            className="w-9 h-9 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-red-700 hover:text-red-800 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
