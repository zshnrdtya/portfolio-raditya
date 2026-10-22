'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScanFace, ShieldCheck, Loader2 } from 'lucide-react';
import { DeviceCard, PasskeyDeviceItem } from './DeviceCard';
import { DeviceRegisterForm } from './DeviceRegisterForm';

interface AdminSecurityTabProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({ onShowToast }) => {
  const [devices, setDevices] = useState<PasskeyDeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/passkey/devices');
      const data = await res.json();
      if (res.ok && data.devices) {
        setDevices(data.devices);
      }
    } catch {
      onShowToast('Gagal memuat daftar perangkat biometrik.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch('/api/admin/passkey/devices');
        const data = await res.json();
        if (isMounted && res.ok && data.devices) {
          setDevices(data.devices);
        }
      } catch {
        if (isMounted) onShowToast('Gagal memuat daftar perangkat biometrik.', 'error');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [onShowToast]);

  const handleDeleteDevice = async (id: string, name: string) => {
    if (
      !confirm(
        `Hapus perangkat biometrik "${name}"? Anda tidak dapat login lagi menggunakan perangkat ini hingga didaftarkan ulang.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/passkey/devices?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        onShowToast(data.error || 'Gagal menghapus perangkat.', 'error');
        return;
      }

      onShowToast('Perangkat berhasil dihapus.', 'success');
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch {
      onShowToast('Terjadi kesalahan saat menghapus perangkat.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-surface shadow-neu-out flex items-center justify-center text-accent shrink-0 border border-white/50">
              <ScanFace size={24} />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-lg sm:text-xl text-textMain tracking-tight">
                Keamanan & Autentikasi Biometrik
              </h2>
              <p className="font-inter text-xs sm:text-sm text-textMain/70 mt-0.5">
                Gunakan Apple Face ID, Touch ID, atau Windows Hello untuk masuk ke Dashraditya tanpa kata sandi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface shadow-neu-in text-xs font-semibold text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>FIDO2 / WebAuthn Standar</span>
          </div>
        </div>
      </div>

      {/* Form Pendaftaran Perangkat Baru */}
      <DeviceRegisterForm onSuccess={fetchDevices} onShowToast={onShowToast} />

      {/* Daftar Perangkat Terdaftar */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60">
        <h3 className="font-poppins font-bold text-base text-textMain mb-4">
          Daftar Perangkat Terdaftar ({devices.length})
        </h3>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-textMain/70">
            <Loader2 size={24} className="animate-spin text-accent mb-2" />
            <p className="font-inter text-xs">Memuat daftar perangkat...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="py-10 text-center rounded-2xl bg-surface shadow-neu-in p-6">
            <ScanFace size={36} className="mx-auto text-textMain/40 mb-2" />
            <p className="font-poppins font-bold text-sm text-textMain">Belum Ada Perangkat Terdaftar</p>
            <p className="font-inter text-xs text-textMain/65 mt-1 max-w-md mx-auto">
              Daftarkan perangkat pertama Anda di form atas untuk mengaktifkan login instan dengan Face ID atau Windows Hello.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onDelete={handleDeleteDevice}
                isDeleting={deletingId === device.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
