'use client';

import React from 'react';
import { PORTFOLIO_EXPERIENCES } from '@/data/portfolioData';

export const ExperienceOutput: React.FC = () => {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <p className="text-slate-400 font-mono text-xs">
        Riwayat pengalaman kerja profesional, kepemimpinan, dan proyek:
      </p>

      <div className="space-y-3">
        {PORTFOLIO_EXPERIENCES.map((exp, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono">
              <h4 className="font-bold text-slate-100 text-sm">
                {exp.role} <span className="text-emerald-400">@ {exp.organization}</span>
              </h4>
              <span className="text-xs text-amber-400 font-semibold">{exp.period}</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {exp.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {exp.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-400"
                >
                  #{badge}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
