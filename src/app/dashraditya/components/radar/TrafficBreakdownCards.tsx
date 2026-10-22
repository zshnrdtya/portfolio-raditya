'use client';

import React from 'react';
import { Laptop, Compass, Globe, BarChart2 } from 'lucide-react';

export interface TelemetryStatsData {
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

interface TrafficBreakdownCardsProps {
  stats: TelemetryStatsData | null;
  isLoading: boolean;
}

export const TrafficBreakdownCards: React.FC<TrafficBreakdownCardsProps> = ({
  stats,
  isLoading,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-3xl bg-surface shadow-neu-out animate-pulse" />
        ))}
      </div>
    );
  }

  const totalDeviceVisits = stats.devices.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const maxTrend = Math.max(...stats.dailyTrend.map((t) => t.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Tren Kunjungan 7 Hari */}
      <div className="bg-surface rounded-3xl p-6 sm:p-7 shadow-neu-out border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-accent" />
          <h3 className="font-poppins font-bold text-base text-textMain">Tren Kunjungan 7 Hari</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-36 pt-4 border-b border-textMain/10">
          {stats.dailyTrend.map((item) => {
            const heightPercent = Math.max(8, Math.round((item.count / maxTrend) * 100));
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-textMain/70 font-semibold">{item.count}</span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[28px] rounded-t-lg bg-accent shadow-neu-out transition-all duration-500"
                />
                <span className="text-[10px] font-inter text-textMain/60 truncate w-full text-center">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Distribusi Perangkat */}
      <div className="bg-surface rounded-3xl p-6 sm:p-7 shadow-neu-out border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <Laptop size={18} className="text-accent" />
          <h3 className="font-poppins font-bold text-base text-textMain">Distribusi Perangkat</h3>
        </div>
        <div className="space-y-3.5">
          {stats.devices.length === 0 ? (
            <p className="text-xs font-inter text-textMain/60 py-4 text-center">Belum ada data perangkat</p>
          ) : (
            stats.devices.map((d) => {
              const percent = Math.round((d.count / totalDeviceVisits) * 100);
              return (
                <div key={d.device} className="space-y-1">
                  <div className="flex justify-between text-xs font-inter font-semibold text-textMain">
                    <span>{d.device}</span>
                    <span>{d.count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface shadow-neu-in overflow-hidden p-0.5">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full rounded-full bg-accent transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Sumber Rujukan (Referrers) */}
      <div className="bg-surface rounded-3xl p-6 sm:p-7 shadow-neu-out border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-accent" />
          <h3 className="font-poppins font-bold text-base text-textMain">Sumber Rujukan Teratas</h3>
        </div>
        <div className="space-y-2.5">
          {stats.referrers.length === 0 ? (
            <p className="text-xs font-inter text-textMain/60 py-4 text-center">Belum ada rujukan</p>
          ) : (
            stats.referrers.map((ref) => (
              <div
                key={ref.referrer}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface shadow-neu-in text-xs font-inter"
              >
                <span className="font-semibold text-textMain truncate max-w-[200px]">{ref.referrer}</span>
                <span className="px-2 py-0.5 rounded bg-surface shadow-neu-out font-mono text-[11px] font-bold text-accent">
                  {ref.count} kunjungan
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Negara Teratas */}
      <div className="bg-surface rounded-3xl p-6 sm:p-7 shadow-neu-out border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-accent" />
          <h3 className="font-poppins font-bold text-base text-textMain">Negara Pengunjung</h3>
        </div>
        <div className="space-y-2.5">
          {stats.countries.length === 0 ? (
            <p className="text-xs font-inter text-textMain/60 py-4 text-center">Belum ada data negara</p>
          ) : (
            stats.countries.map((c) => (
              <div
                key={c.country}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface shadow-neu-in text-xs font-inter"
              >
                <span className="font-bold text-textMain">{c.country}</span>
                <span className="px-2 py-0.5 rounded bg-surface shadow-neu-out font-mono text-[11px] font-bold text-emerald-800">
                  {c.count} sesi
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
