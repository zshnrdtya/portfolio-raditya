'use client';

import React from 'react';
import { PORTFOLIO_SKILLS } from '@/data/portfolioData';

export const SkillsOutput: React.FC = () => {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <p className="text-slate-400 font-mono text-xs">
        Stack teknologi dan keahlian yang dikuasai:
      </p>

      <div className="space-y-3 font-mono">
        {PORTFOLIO_SKILLS.map((group) => (
          <div key={group.category} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
              <span className="text-slate-500">📁</span>
              <span>{group.category}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 pl-6">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 text-xs border border-slate-700/60 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
