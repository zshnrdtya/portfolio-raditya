'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  isLoading: boolean;
  isBatchProcessing: boolean;
  onRefresh: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isLoading,
  isBatchProcessing,
  onRefresh,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          aria-label="Kembali ke Beranda"
          className="w-11 h-11 rounded-full bg-surface shadow-neu-out flex items-center justify-center text-textMain hover:shadow-neu-in focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all shrink-0 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-poppins text-textMain tracking-tight">
              Moderasi Buku Tamu
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface shadow-neu-in text-[11px] font-semibold text-accent">
              <ShieldCheck size={13} />
              Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-textMain/85 font-inter mt-0.5">
            Pusat persetujuan pesan dan balasan pengunjung portofolio.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isLoading || isBatchProcessing}
          aria-label="Segarkan data pesan"
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold bg-surface shadow-neu-out rounded-full text-textMain hover:shadow-neu-in focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw
            size={14}
            className={isLoading ? 'animate-spin text-accent' : 'text-textMain'}
          />
          <span>Segarkan</span>
        </button>
      </div>
    </header>
  );
};
