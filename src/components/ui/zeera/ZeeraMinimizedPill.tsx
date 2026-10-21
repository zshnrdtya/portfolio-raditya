'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

interface ZeeraMinimizedPillProps {
  onRestore: () => void;
  onClose: () => void;
}

export const ZeeraMinimizedPill: React.FC<ZeeraMinimizedPillProps> = ({
  onRestore,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onRestore}
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[var(--color-surface)] shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/60 cursor-pointer hover:scale-105 transition-all select-none group"
      title="Buka kembali Zeera AI"
      role="button"
      aria-label="Kembalikan Zeera AI"
    >
      <div className="p-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)]">
        <MessageSquare className="w-4 h-4 text-[#136846] animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-poppins font-bold text-xs text-[var(--color-textMain)]">
          Zeera AI
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Copilot
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        title="Tutup"
        className="p-1 rounded-full text-[var(--color-textMain)] hover:text-red-600 transition-colors ml-1 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
