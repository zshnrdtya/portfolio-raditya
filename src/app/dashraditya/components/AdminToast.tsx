'use client';

import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';
import { ToastState } from '../types';

interface AdminToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface text-textMain border-2 border-accent/40 shadow-neu-out rounded-2xl px-5 py-3.5 flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-[90vw] animate-in fade-in slide-in-from-bottom-2"
    >
      {toast.type === 'success' ? (
        <div className="w-6 h-6 rounded-lg bg-surface shadow-neu-in flex items-center justify-center text-accent shrink-0">
          <Check size={14} />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-lg bg-surface shadow-neu-in flex items-center justify-center text-[#991B1B] shrink-0">
          <AlertCircle size={14} />
        </div>
      )}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="ml-1 text-textMain/85 hover:text-textMain cursor-pointer"
      >
        <X size={14} />
      </button>
    </aside>
  );
};
