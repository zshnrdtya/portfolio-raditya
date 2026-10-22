'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
} from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

export function AdminFloatingBar() {
  const { isAdmin, isEditMode, setIsEditMode, toastMessage, clearToast } = useSiteContent();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Jangan render apapun jika pengunjung bukan admin
  if (!isAdmin) return null;

  return (
    <>
      {/* Toast Notifikasi Perubahan Konten */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 bg-surface shadow-neu-out border border-white/60 rounded-2xl px-4 py-3 flex items-center gap-3 text-textMain"
          >
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
              <Check size={14} />
            </div>
            <p className="font-poppins font-bold text-xs">{toastMessage}</p>
            <button
              type="button"
              onClick={clearToast}
              aria-label="Tutup notifikasi"
              className="text-textMain/60 hover:text-textMain cursor-pointer ml-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toolbar */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <div className="bg-surface shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/70 rounded-full p-1.5 flex items-center gap-2">
          {/* Admin Badge */}
          <div className="flex items-center gap-1.5 pl-3 pr-1 py-1">
            <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck size={15} />
            </div>
            {!isCollapsed && (
              <span className="hidden sm:inline font-poppins font-bold text-xs text-textMain tracking-tight">
                Inline CMS
              </span>
            )}
          </div>

          {!isCollapsed && (
            <>
              {/* Toggle Mode Edit */}
              <button
                type="button"
                onClick={() => setIsEditMode((prev) => !prev)}
                className={`min-h-[42px] px-3.5 py-1.5 rounded-full font-poppins font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isEditMode
                    ? 'bg-accent text-white shadow-neu-in'
                    : 'bg-surface text-textMain/80 shadow-neu-out hover:shadow-neu-in'
                }`}
                title={isEditMode ? 'Nonaktifkan Mode Edit' : 'Aktifkan Mode Edit'}
              >
                <Pencil size={13} className={isEditMode ? 'animate-bounce' : ''} />
                <span>{isEditMode ? 'Mode Edit: AKTIF' : 'Mode Edit: NONAKTIF'}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEditMode ? 'bg-emerald-300 animate-pulse' : 'bg-gray-400'
                  }`}
                />
              </button>

              {/* Tautan Dashraditya */}
              <Link
                href="/dashraditya"
                className="min-h-[42px] px-3 py-1.5 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in font-poppins font-bold text-xs text-textMain flex items-center gap-1.5 transition-all cursor-pointer"
                title="Buka Dashboard Admin Lengkap"
              >
                <LayoutDashboard size={13} className="text-accent" />
                <span className="hidden sm:inline">Dashraditya</span>
              </Link>
            </>
          )}

          {/* Tombol Minimize / Expand */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? 'Buka bilah admin' : 'Perkecil bilah admin'}
            className="w-8 h-8 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in flex items-center justify-center text-textMain/75 hover:text-textMain transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>
    </>
  );
}
