'use client';

import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';

interface TerminalHeaderProps {
  onClear: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ onClear }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 rounded-t-2xl select-none">
      {/* Left: Window Dots */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500/90 hover:bg-red-600 transition-colors cursor-pointer" />
        <span className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-600 transition-colors cursor-pointer" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-600 transition-colors cursor-pointer" />
      </div>

      {/* Center: Title & Branch */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
        <Terminal size={14} className="text-emerald-400" />
        <span className="font-semibold text-slate-200">raditya@portfolio</span>
        <span className="text-slate-500">:</span>
        <span className="text-sky-400">~</span>
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 border border-slate-700/60">
          git:(feat/terminal-concept)
        </span>
      </div>

      {/* Right: Quick Clear */}
      <button
        type="button"
        onClick={onClear}
        title="Bersihkan Terminal (clear)"
        aria-label="Bersihkan riwayat terminal"
        className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
