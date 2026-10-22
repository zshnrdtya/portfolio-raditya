'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Loader2 } from 'lucide-react';

interface StatsResponse {
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

export const StatsOutput: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/telemetry/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setStats(data);
        }
      } catch {
        // Abaikan jika tidak diizinkan / public fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-3 font-mono text-xs sm:text-sm">
      <div className="flex items-center justify-between text-slate-400 text-xs">
        <span className="flex items-center gap-1.5">
          <Activity size={14} className="text-emerald-400" />
          <span>Telemetri & Analitik Kunjungan Portofolio</span>
        </span>
        {isLoading && <Loader2 size={14} className="animate-spin text-emerald-400" />}
      </div>

      {!stats ? (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <p className="text-xs">
            Sistem telemetri aktif memantau lalu lintas pengunjung secara real-time via Server-Sent Events (SSE).
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Data statistik mendalam terintegrasi di dashboard admin melalui perintah <strong className="text-emerald-400">login</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Perangkat */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h5 className="text-amber-400 font-bold mb-2">Distribusi Perangkat:</h5>
            <div className="space-y-1 text-xs">
              {stats.devices.map((d) => (
                <div key={d.device} className="flex justify-between text-slate-300">
                  <span>{d.device}</span>
                  <span className="text-emerald-400 font-bold">{d.count} sesi</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negara */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h5 className="text-amber-400 font-bold mb-2">Negara Pengunjung:</h5>
            <div className="space-y-1 text-xs">
              {stats.countries.map((c) => (
                <div key={c.country} className="flex justify-between text-slate-300">
                  <span>{c.country}</span>
                  <span className="text-sky-400 font-bold">{c.count} kunjungan</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
