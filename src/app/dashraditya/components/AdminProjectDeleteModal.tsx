'use client';

import React from 'react';
import { ProjectItem } from '../types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AdminProjectDeleteModalProps {
  isOpen: boolean;
  project: ProjectItem | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const AdminProjectDeleteModal: React.FC<AdminProjectDeleteModalProps> = ({
  isOpen,
  project,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textMain/40 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-surface rounded-3xl p-6 shadow-neu-out border border-white/60">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface shadow-neu-in flex items-center justify-center text-red-700 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3
              id="delete-project-modal-title"
              className="font-poppins font-black text-lg text-textMain"
            >
              Hapus Proyek?
            </h3>
            <p className="font-inter text-xs text-textMain/80">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <p className="font-inter text-sm text-textMain/90 mb-6 bg-surface shadow-neu-in p-3.5 rounded-xl">
          Apakah Anda yakin ingin menghapus proyek{' '}
          <strong className="text-textMain font-bold">&ldquo;{project.title}&rdquo;</strong> dari portofolio?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-red-700 text-white font-poppins font-bold text-xs shadow-neu-out hover:bg-red-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Ya, Hapus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
