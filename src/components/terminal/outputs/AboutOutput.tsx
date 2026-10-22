'use client';

import React from 'react';
import { PORTFOLIO_PROFILE } from '@/data/portfolioData';

export const AboutOutput: React.FC = () => {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold font-sans text-base text-slate-100">
            {PORTFOLIO_PROFILE.name}
          </h3>
          <span className="text-xs text-slate-400 font-mono">({PORTFOLIO_PROFILE.handle})</span>
        </div>
        <p className="font-mono text-emerald-400 text-xs">
          {PORTFOLIO_PROFILE.role} • {PORTFOLIO_PROFILE.education}
        </p>
        <p className="text-slate-400 text-xs font-mono">
          Lokasi: {PORTFOLIO_PROFILE.location}
        </p>
      </div>

      <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
        {PORTFOLIO_PROFILE.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {PORTFOLIO_PROFILE.stats.map((stat, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-center">
            <span className="block font-mono font-bold text-lg text-sky-400">
              {stat.value}
            </span>
            <span className="text-[11px] font-sans text-slate-400 leading-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
