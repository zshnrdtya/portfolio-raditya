'use client';

import React from 'react';
import Link from 'next/link';
import { TerminalHistoryItem } from './types';
import { WelcomeBanner } from './outputs/WelcomeBanner';
import { HelpOutput } from './outputs/HelpOutput';
import { AboutOutput } from './outputs/AboutOutput';
import { ProjectsOutput } from './outputs/ProjectsOutput';
import { SkillsOutput } from './outputs/SkillsOutput';
import { ExperienceOutput } from './outputs/ExperienceOutput';
import { AchievementsOutput } from './outputs/AchievementsOutput';
import { ContactOutput } from './outputs/ContactOutput';
import { GuestbookOutput } from './outputs/GuestbookOutput';
import { StatsOutput } from './outputs/StatsOutput';
import { AiOutput } from './outputs/AiOutput';

interface TerminalHistoryProps {
  history: TerminalHistoryItem[];
  onRunCommand: (cmd: string) => void;
}

export const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history, onRunCommand }) => {
  const renderOutput = (item: TerminalHistoryItem) => {
    switch (item.type) {
      case 'WELCOME':
        return <WelcomeBanner onRunCommand={onRunCommand} />;
      case 'HELP':
        return <HelpOutput onRunCommand={onRunCommand} />;
      case 'ABOUT':
        return <AboutOutput />;
      case 'PROJECTS':
        return <ProjectsOutput />;
      case 'SKILLS':
        return <SkillsOutput />;
      case 'EXPERIENCE':
        return <ExperienceOutput />;
      case 'AWARDS':
        return <AchievementsOutput />;
      case 'CONTACT':
        return <ContactOutput />;
      case 'GUESTBOOK':
        return <GuestbookOutput />;
      case 'STATS':
        return <StatsOutput />;
      case 'AI':
        return <AiOutput prompt={item.rawArgs || ''} />;
      case 'LOGIN':
        return (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-2">
            <p className="text-emerald-400 font-bold">
              Mengalihkan ke Portal Administrator Dashraditya...
            </p>
            <p className="text-slate-400">
              Gunakan Face ID / Passkey biometrik atau kredensial admin Anda untuk masuk.
            </p>
            <Link
              href="/dashraditya/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all min-h-[36px]"
            >
              Buka Halaman Login Dashraditya &rarr;
            </Link>
          </div>
        );
      case 'UNKNOWN':
      default:
        return (
          <div className="text-red-400 font-mono text-xs space-y-1">
            <p>
              Perintah tidak dikenali: <span className="font-bold underline">{item.command}</span>
            </p>
            <p className="text-slate-400">
              Ketik <button type="button" onClick={() => onRunCommand('help')} className="text-sky-400 underline font-bold cursor-pointer">help</button> untuk melihat daftar perintah yang didukung.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <div key={item.id} className="space-y-2">
          {/* Prompt line (kecuali untuk pesan banner awal jika command kosong) */}
          {item.command && (
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
              <span className="text-emerald-400 font-bold">guest@raditya:~$</span>
              <span className="text-slate-100 font-bold">{item.command}</span>
            </div>
          )}

          {/* Render output content */}
          <div className="pl-0 sm:pl-2">{renderOutput(item)}</div>
        </div>
      ))}
    </div>
  );
};
