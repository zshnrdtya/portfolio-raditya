'use client';

import React from 'react';
import { Smartphone, Laptop, Tablet, Globe, Compass, Clock, Activity } from 'lucide-react';

export interface ActiveVisitor {
  id: string;
  sessionId: string;
  device: string;
  browser: string;
  country: string;
  city: string | null;
  path: string;
  referrer: string | null;
  createdAt: string;
  lastSeenAt: string;
}

interface LiveVisitorFeedProps {
  visitors: ActiveVisitor[];
}

export const LiveVisitorFeed: React.FC<LiveVisitorFeedProps> = ({ visitors }) => {
  const getDeviceIcon = (device: string) => {
    if (device === 'Mobile') return Smartphone;
    if (device === 'Tablet') return Tablet;
    return Laptop;
  };

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-emerald-700" />
          <h3 className="font-poppins font-bold text-base text-textMain">
            Sesi Pengunjung Aktif ({visitors.length})
          </h3>
        </div>
        <span className="text-xs font-inter text-textMain/65 font-medium">
          Diperbarui otomatis tiap 3 dtk
        </span>
      </div>

      {visitors.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-surface shadow-neu-in p-6">
          <Globe size={36} className="mx-auto text-textMain/40 mb-2 animate-pulse" />
          <p className="font-poppins font-bold text-sm text-textMain">Tidak Ada Pengunjung Aktif</p>
          <p className="font-inter text-xs text-textMain/65 mt-1 max-w-md mx-auto">
            Radar sedang memantau. Coba buka beranda portofolio di tab atau perangkat lain untuk melihat radar mendeteksi kehadiran secara instan.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-textMain/10">
          {visitors.map((visitor) => {
            const DeviceIcon = getDeviceIcon(visitor.device);
            return (
              <div
                key={visitor.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-2"
              >
                {/* Device & Location */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface shadow-neu-in flex items-center justify-center text-accent shrink-0">
                    <DeviceIcon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-surface shadow-neu-out text-[10px] font-bold text-textMain">
                        {visitor.country}
                      </span>
                      <span className="font-poppins font-bold text-sm text-textMain">
                        {visitor.city || 'Indonesia'}
                      </span>
                      <span className="text-xs text-textMain/60 font-inter">
                        ({visitor.browser} - {visitor.device})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-inter text-textMain/70 mt-0.5">
                      <span className="font-mono text-accent">{visitor.path}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px] text-textMain/60">
                        <Compass size={11} />
                        {visitor.referrer || 'Langsung'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Relative Time */}
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-inter text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-ping" />
                  <Clock size={12} className="text-emerald-700" />
                  <span>Aktif: {formatTime(visitor.lastSeenAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
