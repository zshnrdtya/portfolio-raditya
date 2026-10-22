'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  FolderGit2,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  LogOut,
  ShieldCheck,
  ScanFace,
  Radio,
  X,
} from 'lucide-react';
import { DashboardTab } from '../types';

interface AdminSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isLoading: boolean;
  isBatchProcessing: boolean;
  onRefresh: () => void;
  pendingGuestbookCount?: number;
  totalProjectsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  isLoading,
  isBatchProcessing,
  onRefresh,
  pendingGuestbookCount = 0,
  totalProjectsCount = 0,
}) => {
  const navItems = [
    {
      id: 'PROJECTS' as DashboardTab,
      label: 'Featured Projects',
      icon: FolderGit2,
      count: totalProjectsCount,
      badgeColor: 'bg-surface shadow-neu-in text-accent',
    },
    {
      id: 'GUESTBOOK' as DashboardTab,
      label: 'Buku Tamu',
      icon: MessageSquare,
      count: pendingGuestbookCount,
      badgeColor:
        pendingGuestbookCount > 0
          ? 'bg-amber-200 text-amber-950 font-black'
          : 'bg-surface shadow-neu-in text-textMain/70',
    },
    {
      id: 'SECURITY' as DashboardTab,
      label: 'Keamanan & Face ID',
      icon: ScanFace,
    },
    {
      id: 'RADAR' as DashboardTab,
      label: 'Traffic Radar',
      icon: Radio,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 sm:p-6 bg-surface">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-textMain/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface shadow-neu-out border border-white/50 flex items-center justify-center text-accent font-poppins font-black text-lg">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-poppins font-bold text-base text-textMain tracking-tight">
                  Dashraditya
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-surface shadow-neu-in text-[10px] font-bold text-accent">
                  Admin
                </span>
              </div>
              <p className="font-inter text-[11px] text-textMain/65">
                Panel Moderasi Portofolio
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="lg:hidden w-9 h-9 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="font-poppins font-bold text-[10px] uppercase tracking-wider text-textMain/55 px-2 mb-2">
            Menu Utama
          </p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl font-poppins font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-surface shadow-neu-in text-accent border border-accent/25'
                      : 'bg-surface shadow-neu-out hover:shadow-neu-in text-textMain/75 hover:text-textMain'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={isActive ? 'text-accent' : 'text-textMain/70'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${item.badgeColor}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Public Site Link */}
        <div>
          <p className="font-poppins font-bold text-[10px] uppercase tracking-wider text-textMain/55 px-2 mb-2">
            Navigasi Luar
          </p>
          <Link
            href="/"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-surface shadow-neu-out hover:shadow-neu-in font-poppins font-medium text-xs text-textMain/80 flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* Bottom Section: Admin Profile & Actions */}
      <div className="pt-5 border-t border-textMain/10 space-y-3">
        {/* Profile Card */}
        <div className="p-3 rounded-2xl bg-surface shadow-neu-in flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-poppins font-bold text-xs text-textMain truncate">
              Raditya Rai Zeeshan
            </p>
            <p className="font-inter text-[10px] text-textMain/65 truncate">
              radityaraizeeshan@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading || isBatchProcessing}
            aria-label="Segarkan data dashboard"
            className="min-h-[42px] px-3 py-2 rounded-xl bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={isLoading ? 'animate-spin text-accent' : 'text-textMain/75'}
            />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/dashraditya' })}
            aria-label="Keluar dari akun admin"
            className="min-h-[42px] px-3 py-2 rounded-xl bg-surface shadow-neu-out hover:shadow-neu-in text-red-700 hover:text-red-900 font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 border-r border-textMain/10 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
