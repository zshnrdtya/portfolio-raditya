'use client';

import React from 'react';
import { TERMINAL_COMMANDS_LIST } from '@/data/portfolioData';

interface HelpOutputProps {
  onRunCommand: (cmd: string) => void;
}

export const HelpOutput: React.FC<HelpOutputProps> = ({ onRunCommand }) => {
  return (
    <div className="space-y-3 font-mono text-xs sm:text-sm">
      <p className="text-slate-400">
        Berikut daftar perintah yang tersedia di terminal ini:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {TERMINAL_COMMANDS_LIST.map((item) => (
          <button
            key={item.command}
            type="button"
            onClick={() => onRunCommand(item.command)}
            className="text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold group-hover:text-emerald-300">
                $&gt; {item.command}
              </span>
            </div>
            <span className="text-slate-400 text-[11px] font-sans mt-0.5">
              {item.desc}
            </span>
          </button>
        ))}
      </div>

      <p className="text-slate-400 text-xs pt-1">
        Tips: Anda bisa menggunakan tombol panah <span className="text-amber-400 font-bold">Atas / Bawah</span> pada keyboard untuk memanggil riwayat perintah.
      </p>
    </div>
  );
};
