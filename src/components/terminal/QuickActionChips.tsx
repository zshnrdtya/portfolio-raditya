'use client';

import React from 'react';
import {
  HelpCircle,
  User,
  FolderGit2,
  Code2,
  Briefcase,
  Trophy,
  MessageSquare,
  Mail,
  Activity,
  LogIn,
} from 'lucide-react';

interface QuickActionChipsProps {
  onRunCommand: (cmd: string) => void;
}

const CHIP_ACTIONS = [
  { label: 'help', icon: HelpCircle, color: 'text-amber-400' },
  { label: 'about', icon: User, color: 'text-sky-400' },
  { label: 'projects', icon: FolderGit2, color: 'text-emerald-400' },
  { label: 'skills', icon: Code2, color: 'text-purple-400' },
  { label: 'experience', icon: Briefcase, color: 'text-amber-400' },
  { label: 'awards', icon: Trophy, color: 'text-yellow-400' },
  { label: 'guestbook', icon: MessageSquare, color: 'text-pink-400' },
  { label: 'contact', icon: Mail, color: 'text-emerald-400' },
  { label: 'stats', icon: Activity, color: 'text-cyan-400' },
  { label: 'login', icon: LogIn, color: 'text-rose-400' },
];

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onRunCommand }) => {
  return (
    <div className="pt-3 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-2">
        <span>Aksi Cepat (Quick Chips):</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CHIP_ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onRunCommand(item.label)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
            >
              <Icon size={14} className={item.color} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
