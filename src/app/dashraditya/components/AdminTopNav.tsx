'use client';

import React from 'react';
import { Menu, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { DashboardTab } from '../types';

interface AdminTopNavProps {
  activeTab: DashboardTab;
  onOpenMobileSidebar: () => void;
  isLoading: boolean;
  isBatchProcessing: boolean;
  onRefresh: () => void;
  onAddNewProject?: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  activeTab,
  onOpenMobileSidebar,
  isLoading,
  isBatchProcessing,
  onRefresh,
  onAddNewProject,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-textMain/10">
      {/* Left: Mobile hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Buka navigasi sidebar"
          className="lg:hidden w-11 h-11 rounded-2xl bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain cursor-pointer shrink-0"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-poppins font-black text-xl sm:text-2xl text-textMain tracking-tight">
              {activeTab === 'PROJECTS'
                ? 'Featured Projects'
                : activeTab === 'GUESTBOOK'
                ? 'Buku Tamu'
                : activeTab === 'SECURITY'
                ? 'Keamanan & Face ID'
                : 'Live Traffic Radar'}
            </h1>
            {activeTab === 'PROJECTS' && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface shadow-neu-in text-[11px] font-bold text-accent">
                <Sparkles size={12} />
                Gemini AI Ready
              </span>
            )}
            {activeTab === 'SECURITY' && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface shadow-neu-in text-[11px] font-bold text-emerald-800">
                WebAuthn Passkey
              </span>
            )}
            {activeTab === 'RADAR' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-surface shadow-neu-in text-[11px] font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
                Live Telemetri
              </span>
            )}
          </div>
          <p className="font-inter text-xs sm:text-sm text-textMain/75 mt-0.5">
            {activeTab === 'PROJECTS'
              ? 'Kelola karya unggulan portofolio dan hasilkan deskripsi cerdas.'
              : activeTab === 'GUESTBOOK'
              ? 'Pusat persetujuan moderasi pesan pengunjung.'
              : activeTab === 'SECURITY'
              ? 'Kelola perangkat biometrik Face ID & Windows Hello untuk akses cepat.'
              : 'Pantau pengunjung aktif, negara asal, dan analitik secara langsung.'}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {activeTab === 'PROJECTS' && onAddNewProject && (
          <button
            type="button"
            onClick={onAddNewProject}
            className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-poppins font-bold bg-accent text-white shadow-neu-out rounded-2xl hover:brightness-110 active:brightness-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Proyek</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isBatchProcessing}
          aria-label="Segarkan data saat ini"
          className="min-h-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-poppins font-bold bg-surface shadow-neu-out rounded-2xl text-textMain hover:shadow-neu-in focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw
            size={14}
            className={isLoading ? 'animate-spin text-accent' : 'text-textMain'}
          />
          <span className="hidden sm:inline">Segarkan</span>
        </button>
      </div>
    </header>
  );
};
