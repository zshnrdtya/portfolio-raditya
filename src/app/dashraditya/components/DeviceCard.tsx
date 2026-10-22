'use client';

import React from 'react';
import { Smartphone, Laptop, Trash2, Loader2, Calendar, Clock } from 'lucide-react';

export interface PasskeyDeviceItem {
  id: string;
  deviceName: string;
  deviceType: string;
  createdAt: string;
  lastUsedAt: string | null;
}

interface DeviceCardProps {
  device: PasskeyDeviceItem;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDelete, isDeleting }) => {
  const isPhone = /iPhone|Android|Mobile/i.test(device.deviceName);
  const DeviceIcon = isPhone ? Smartphone : Laptop;

  return (
    <div className="p-5 rounded-2xl bg-surface shadow-neu-out border border-white/50 flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface shadow-neu-in flex items-center justify-center text-accent shrink-0">
            <DeviceIcon size={18} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-sm text-textMain">
              {device.deviceName}
            </h4>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-inter text-[11px] font-semibold">
              Aktif & Terverifikasi
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(device.id, device.deviceName)}
          disabled={isDeleting}
          aria-label={`Hapus perangkat ${device.deviceName}`}
          className="w-9 h-9 rounded-xl bg-surface shadow-neu-out hover:shadow-neu-in active:shadow-neu-in flex items-center justify-center text-red-600 hover:text-red-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin text-red-600" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      <div className="pt-3 border-t border-textMain/10 grid grid-cols-2 gap-2 text-[11px] font-inter text-textMain/70">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-textMain/50" />
          <span>
            {new Date(device.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-textMain/50" />
          <span>
            {device.lastUsedAt
              ? `Dipakai: ${new Date(device.lastUsedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}`
              : 'Belum dipakai'}
          </span>
        </div>
      </div>
    </div>
  );
};
