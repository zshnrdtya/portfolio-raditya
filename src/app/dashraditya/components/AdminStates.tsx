'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Search, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminLoadingState: React.FC = () => {
  return (
    <section aria-label="Memuat antrean pesan" className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface shadow-neu-out rounded-3xl p-5 sm:p-6 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-surface shadow-neu-in" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded-full bg-surface shadow-neu-in" />
                <div className="h-3 w-20 rounded-full bg-surface shadow-neu-in" />
              </div>
            </div>
            <div className="h-3 w-24 rounded-full bg-surface shadow-neu-in" />
          </div>
          <div className="h-3 w-full rounded-full bg-surface shadow-neu-in" />
          <div className="h-3 w-4/5 rounded-full bg-surface shadow-neu-in" />
          <div className="flex gap-2 pt-2">
            <div className="h-11 w-28 rounded-full bg-surface shadow-neu-in" />
            <div className="h-11 w-28 rounded-full bg-surface shadow-neu-in" />
          </div>
        </div>
      ))}
    </section>
  );
};

interface AdminErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export const AdminErrorState: React.FC<AdminErrorStateProps> = ({
  errorMessage,
  onRetry,
}) => {
  return (
    <section
      aria-label="Pemberitahuan galat"
      className="bg-surface shadow-neu-out rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-[#991B1B] mx-auto">
        <AlertCircle size={28} />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-poppins text-textMain">
          Kendala Memuat Data
        </h2>
        <p className="text-xs sm:text-sm text-textMain/85 font-inter mt-1.5">
          {errorMessage}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-[44px] px-6 py-2.5 rounded-full bg-accent text-white shadow-neu-out hover:opacity-95 active:shadow-neu-in text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <RefreshCw size={14} />
        <span>Coba Muat Ulang</span>
      </button>
    </section>
  );
};

export const AdminEmptyState: React.FC = () => {
  return (
    <section
      aria-label="Antrean kosong"
      className="bg-surface shadow-neu-out rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto space-y-4"
    >
      <div className="w-16 h-16 rounded-3xl bg-surface shadow-neu-in flex items-center justify-center text-accent mx-auto">
        <Check size={32} />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-poppins text-textMain">
          Semua Pesan Sudah Dimoderasi
        </h2>
        <p className="text-xs sm:text-sm text-textMain/85 font-inter mt-1.5">
          Tidak ada antrean pesan pending saat ini. Komentar atau balasan baru yang dikirimkan pengunjung akan tampil otomatis di panel ini.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/#guestbook"
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-xs sm:text-sm font-semibold text-textMain transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Lihat Buku Tamu Publik
        </Link>
      </div>
    </section>
  );
};

interface AdminFilteredEmptyStateProps {
  onReset: () => void;
}

export const AdminFilteredEmptyState: React.FC<AdminFilteredEmptyStateProps> = ({
  onReset,
}) => {
  return (
    <section
      aria-label="Tidak ada hasil filter"
      className="bg-surface shadow-neu-out rounded-3xl p-8 sm:p-10 text-center max-w-md mx-auto space-y-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-textMain/85 mx-auto">
        <Search size={20} />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold font-poppins text-textMain">
          Tidak Ada Pesan yang Cocok
        </h2>
        <p className="text-xs sm:text-sm text-textMain/85 font-inter mt-1">
          Tidak ditemukan pesan pending untuk filter atau kata kunci saat ini.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="min-h-[44px] px-5 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-xs font-semibold text-accent transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        Reset Filter & Pencarian
      </button>
    </section>
  );
};
