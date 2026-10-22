'use client';

import React from 'react';

interface WelcomeBannerProps {
  onRunCommand: (cmd: string) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onRunCommand }) => {
  return (
    <div className="space-y-3 font-mono text-xs sm:text-sm">
      {/* ASCII Art Logo */}
      <pre className="text-emerald-400 font-bold leading-none select-none overflow-x-auto py-1">
{`
  ____            _ _ _                ____      _ 
 |  _ \\ __ _   __| (_) |_ _   _  __ _ |  _ \\ ___(_)
 | |_) / _\` | / _\` | | __| | | |/ _\` || |_) / _ \\ |
 |  _ < (_| || (_| | | |_| |_| | (_| ||  _ <  __/ |
 |_| \\_\\__,_| \\__,_|_|\\__|\\__, |\\__,_||_| \\_\\___|_|
                          |___/                    
`}
      </pre>

      <div className="space-y-1 text-slate-300">
        <p className="font-bold text-slate-100">
          Raditya Rai Zeeshan Developer Terminal <span className="text-emerald-400 font-mono">[v2.4.0]</span>
        </p>
        <p className="text-slate-400 text-xs">
          SMKN 1 Depok (Rekayasa Perangkat Lunak) • Fullstack Web Developer & AI Enthusiast
        </p>
        <p className="text-slate-400 text-xs">
          Ketik <button type="button" onClick={() => onRunCommand('help')} className="text-sky-400 font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded px-1">help</button> untuk melihat daftar perintah, atau gunakan tombol navigasi cepat di bawah.
        </p>
      </div>

      <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
        <span>Sesi: <strong className="text-slate-300">guest@portfolio</strong></span>
        <span>Status: <strong className="text-emerald-400">Siap menerima perintah</strong></span>
        <span>Sistem: <strong className="text-slate-300">Next.js 16 + React 19</strong></span>
      </div>
    </div>
  );
};
