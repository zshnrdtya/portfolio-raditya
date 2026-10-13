'use client';

import React from 'react';
import { MessageSquare, User, Reply } from 'lucide-react';
import { FilterType } from '../types';

interface AdminMetricsProps {
  totalCount: number;
  mainCount: number;
  repliesCount: number;
  filterType: FilterType;
  onSelectFilter: (type: FilterType) => void;
}

export const AdminMetrics: React.FC<AdminMetricsProps> = ({
  totalCount,
  mainCount,
  repliesCount,
  filterType,
  onSelectFilter,
}) => {
  return (
    <section
      aria-label="Ringkasan Antrean Pesan"
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
    >
      {/* Total Pending Card */}
      <button
        type="button"
        onClick={() => onSelectFilter('ALL')}
        className={`p-4 sm:p-5 rounded-3xl transition-all text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          filterType === 'ALL'
            ? 'bg-surface shadow-neu-in border border-accent/40'
            : 'bg-surface shadow-neu-out hover:shadow-neu-in'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-textMain/85">
            Semua Antrean
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface shadow-neu-in flex items-center justify-center text-accent">
            <MessageSquare size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-textMain">
            {totalCount}
          </span>
          <span className="text-xs font-medium text-textMain/85">pesan</span>
        </div>
      </button>

      {/* Main Comments Card */}
      <button
        type="button"
        onClick={() => onSelectFilter('MAIN')}
        className={`p-4 sm:p-5 rounded-3xl transition-all text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          filterType === 'MAIN'
            ? 'bg-surface shadow-neu-in border border-accent/40'
            : 'bg-surface shadow-neu-out hover:shadow-neu-in'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-textMain/85">
            Komentar Utama
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface shadow-neu-in flex items-center justify-center text-accent">
            <User size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-textMain">
            {mainCount}
          </span>
          <span className="text-xs font-medium text-textMain/85">komentar</span>
        </div>
      </button>

      {/* Replies Card */}
      <button
        type="button"
        onClick={() => onSelectFilter('REPLIES')}
        className={`p-4 sm:p-5 rounded-3xl transition-all text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          filterType === 'REPLIES'
            ? 'bg-surface shadow-neu-in border border-accent/40'
            : 'bg-surface shadow-neu-out hover:shadow-neu-in'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-textMain/85">
            Balasan Diskusi
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface shadow-neu-in flex items-center justify-center text-accent">
            <Reply size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-textMain">
            {repliesCount}
          </span>
          <span className="text-xs font-medium text-textMain/85">balasan</span>
        </div>
      </button>
    </section>
  );
};
