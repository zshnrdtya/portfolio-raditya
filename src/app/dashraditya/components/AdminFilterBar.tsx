'use client';

import React from 'react';
import { Search, X, CheckCheck } from 'lucide-react';
import { FilterType } from '../types';

interface AdminFilterBarProps {
  totalCount: number;
  mainCount: number;
  repliesCount: number;
  filterType: FilterType;
  searchQuery: string;
  hasFilteredMessages: boolean;
  isBatchProcessing: boolean;
  onFilterChange: (type: FilterType) => void;
  onSearchChange: (query: string) => void;
  onOpenBatchConfirm: () => void;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  totalCount,
  mainCount,
  repliesCount,
  filterType,
  searchQuery,
  hasFilteredMessages,
  isBatchProcessing,
  onFilterChange,
  onSearchChange,
  onOpenBatchConfirm,
}) => {
  return (
    <section
      aria-label="Pencarian dan Filter Pesan"
      className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-surface p-2 sm:p-3 rounded-3xl shadow-neu-out"
    >
      {/* Filter Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          type="button"
          onClick={() => onFilterChange('ALL')}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            filterType === 'ALL'
              ? 'bg-accent text-white shadow-neu-in'
              : 'bg-surface text-textMain shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          Semua ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('MAIN')}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            filterType === 'MAIN'
              ? 'bg-accent text-white shadow-neu-in'
              : 'bg-surface text-textMain shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          Komentar Utama ({mainCount})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('REPLIES')}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            filterType === 'REPLIES'
              ? 'bg-accent text-white shadow-neu-in'
              : 'bg-surface text-textMain shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          Balasan ({repliesCount})
        </button>
      </div>

      {/* Search Input & Batch Action */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMain/85 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari penulis atau pesan..."
            aria-label="Cari penulis atau pesan"
            className="w-full min-h-[44px] bg-surface shadow-neu-in rounded-2xl pl-9 pr-8 py-2 text-xs sm:text-sm text-textMain placeholder:text-textMain/85 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Bersihkan pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textMain/85 hover:text-textMain cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {hasFilteredMessages && (
          <button
            type="button"
            onClick={onOpenBatchConfirm}
            disabled={isBatchProcessing}
            title="Setujui semua pesan pada daftar ini"
            aria-label="Setujui semua pesan yang tampil"
            className="min-h-[44px] px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-surface shadow-neu-out hover:shadow-neu-in text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <CheckCheck size={15} />
            <span className="hidden sm:inline">Setujui Semua</span>
          </button>
        )}
      </div>
    </section>
  );
};
