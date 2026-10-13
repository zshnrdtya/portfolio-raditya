'use client';

import React, { useEffect } from 'react';
import { CheckCheck } from 'lucide-react';

interface AdminBatchModalProps {
  isOpen: boolean;
  count: number;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminBatchModal: React.FC<AdminBatchModalProps> = ({
  isOpen,
  count,
  isProcessing,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-surface shadow-neu-out rounded-3xl p-6 sm:p-7 max-w-md w-full border border-white/50 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-accent mx-auto">
          <CheckCheck size={24} />
        </div>
        <div className="text-center">
          <h2
            id="batch-confirm-title"
            className="text-lg font-bold font-poppins text-textMain"
          >
            Konfirmasi Setujui Sekaligus
          </h2>
          <p className="text-xs sm:text-sm text-textMain/85 font-inter mt-1.5">
            Anda akan menyetujui dan menerbitkan{' '}
            <strong className="text-textMain font-semibold">
              {count} pesan
            </strong>{' '}
            yang saat ini ditampilkan. Lanjutkan proses?
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 min-h-[44px] px-4 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-xs sm:text-sm font-semibold text-textMain transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 min-h-[44px] px-4 py-2 rounded-full bg-accent text-white shadow-neu-out hover:opacity-95 active:shadow-neu-in text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {isProcessing ? 'Memproses...' : 'Ya, Setujui Semua'}
          </button>
        </div>
      </div>
    </div>
  );
};
