'use client';

import React from 'react';
import { Users, Eye, Radio, Sparkles } from 'lucide-react';

interface LiveRadarHeaderProps {
  activeCount: number;
  totalViews: number;
  uniqueVisitors: number;
  isConnected: boolean;
}

export const LiveRadarHeader: React.FC<LiveRadarHeaderProps> = ({
  activeCount,
  totalViews,
  uniqueVisitors,
  isConnected,
}) => {
  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="bg-surface rounded-3xl p-5 sm:p-6 shadow-neu-out border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-surface shadow-neu-out flex items-center justify-center text-accent shrink-0 border border-white/50">
            <Radio size={22} className={isConnected ? 'animate-pulse text-emerald-800' : 'text-textMain/50'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-poppins font-bold text-base sm:text-lg text-textMain tracking-tight">
                Live Traffic Radar
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isConnected ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-700 animate-ping' : 'bg-amber-700'}`} />
                <span>{isConnected ? 'Realtime SSE Aktif' : 'Menghubungkan Radar...'}</span>
              </span>
            </div>
            <p className="font-inter text-xs text-textMain/70 mt-0.5">
              Pemantauan aktivitas pengunjung portofolio secara instan detik per detik.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Now */}
        <div className="p-5 rounded-3xl bg-surface shadow-neu-out border border-white/50 flex items-center justify-between">
          <div>
            <p className="font-poppins font-bold text-xs uppercase tracking-wider text-textMain/60">
              Online Saat Ini
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-poppins font-black text-3xl sm:text-4xl text-emerald-800">
                {activeCount}
              </span>
              <span className="text-xs font-inter text-textMain/70 font-semibold">pengunjung</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-emerald-800">
            <Users size={22} />
          </div>
        </div>

        {/* Total Views Today */}
        <div className="p-5 rounded-3xl bg-surface shadow-neu-out border border-white/50 flex items-center justify-between">
          <div>
            <p className="font-poppins font-bold text-xs uppercase tracking-wider text-textMain/60">
              Kunjungan Hari Ini
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-poppins font-black text-3xl sm:text-4xl text-accent">
                {totalViews}
              </span>
              <span className="text-xs font-inter text-textMain/70 font-semibold">tampilan</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-accent">
            <Eye size={22} />
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-3xl bg-surface shadow-neu-out border border-white/50 flex items-center justify-between">
          <div>
            <p className="font-poppins font-bold text-xs uppercase tracking-wider text-textMain/60">
              Pengunjung Unik
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-poppins font-black text-3xl sm:text-4xl text-textMain">
                {uniqueVisitors}
              </span>
              <span className="text-xs font-inter text-textMain/70 font-semibold">sesi</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-textMain">
            <Sparkles size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};
