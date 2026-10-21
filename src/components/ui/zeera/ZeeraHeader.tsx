'use client';

import React from 'react';
import {
  X,
  ExternalLink,
  Minus,
  Maximize2,
  Minimize2,
  Bot,
  RotateCcw,
} from 'lucide-react';

interface ZeeraHeaderProps {
  url: string;
  isMaximized: boolean;
  onReset: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export const ZeeraHeader: React.FC<ZeeraHeaderProps> = ({
  url,
  isMaximized,
  onReset,
  onMinimize,
  onToggleMaximize,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] z-10 select-none">
      {/* Branding & Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)] shrink-0">
          <Bot className="w-4 h-4 text-[#136846]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-poppins font-bold text-sm sm:text-base text-[var(--color-textMain)] truncate">
              Zeera AI
            </h3>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Copilot
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-textMain)] opacity-70 truncate">
            Asisten Cerdas Portofolio Raditya
          </p>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onReset}
          title="Ulang percakapan"
          className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
          aria-label="Reset Chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onMinimize}
          title="Kecilkan ke sudut"
          className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleMaximize}
          title={isMaximized ? 'Kembalikan ukuran' : 'Maksimalkan tampilan'}
          className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
          aria-label={isMaximized ? 'Restore View' : 'Maximize View'}
        >
          {isMaximized ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Buka website Zeera AI asli di tab baru"
          className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer flex items-center justify-center"
          aria-label="Open standalone Zeera website"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onClose}
          title="Tutup"
          className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-red-600 active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
