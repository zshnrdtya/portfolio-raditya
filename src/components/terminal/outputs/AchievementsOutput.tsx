'use client';

import React from 'react';
import { PORTFOLIO_ACHIEVEMENTS } from '@/data/portfolioData';

export const AchievementsOutput: React.FC = () => {
  return (
    <div className="space-y-4 text-xs sm:text-sm font-mono">
      <p className="text-slate-400 text-xs">
        Daftar pencapaian kejuaraan marching band dan kompetisi:
      </p>

      <div className="space-y-2">
        {PORTFOLIO_ACHIEVEMENTS.map((item, index) => (
          <div
            key={index}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">🏆</span>
                <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
              </div>
              <p className="text-slate-400 text-xs font-sans pl-6">
                Event: {item.event} • Posisi: <strong className="text-emerald-400">{item.role}</strong>
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-amber-400 font-bold shrink-0">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
