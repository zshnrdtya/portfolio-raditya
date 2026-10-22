'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Plus, ScanFace, Loader2, Info } from 'lucide-react';
import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser';

interface DeviceRegisterFormProps {
  onSuccess: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const emptySubscribe = () => () => {};

export const DeviceRegisterForm: React.FC<DeviceRegisterFormProps> = ({
  onSuccess,
  onShowToast,
}) => {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isSupported = isClient ? browserSupportsWebAuthn() : true;

  const [deviceName, setDeviceName] = useState(() => {
    if (typeof navigator === 'undefined') return 'Perangkat Admin';
    const ua = navigator.userAgent;
    if (/iPhone/i.test(ua)) return 'iPhone Raditya (Face ID)';
    if (/iPad/i.test(ua)) return 'iPad Raditya (Face ID)';
    if (/Macintosh/i.test(ua)) return 'MacBook Raditya (Touch ID)';
    if (/Windows/i.test(ua)) return 'Windows PC Raditya (Windows Hello)';
    if (/Android/i.test(ua)) return 'Android Raditya (Biometrik)';
    return 'Perangkat Admin Raditya';
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering || !deviceName.trim()) return;

    setIsRegistering(true);
    try {
      const optRes = await fetch('/api/admin/passkey/register-options');
      const optData = await optRes.json();

      if (!optRes.ok) {
        onShowToast(optData.error || 'Gagal menyiapkan pendaftaran biometrik.', 'error');
        setIsRegistering(false);
        return;
      }

      let regResponse;
      try {
        regResponse = await startRegistration(optData);
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'NotAllowedError') {
          onShowToast('Pendaftaran biometrik dibatalkan pengguna.', 'error');
        } else {
          onShowToast(error.message || 'Gagal membaca sensor biometrik perangkat.', 'error');
        }
        setIsRegistering(false);
        return;
      }

      const verifyRes = await fetch('/api/admin/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: regResponse,
          deviceName: deviceName.trim(),
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified) {
        onShowToast(verifyData.error || 'Gagal mendaftarkan perangkat biometrik.', 'error');
        setIsRegistering(false);
        return;
      }

      onShowToast('Perangkat biometrik berhasil didaftarkan!', 'success');
      onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      onShowToast('Terjadi kesalahan saat memproses pendaftaran.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
          <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <span>Browser ini belum mendukung WebAuthn. Gunakan Safari, Chrome, atau Edge.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/60">
      <h3 className="font-poppins font-bold text-base text-textMain mb-2 flex items-center gap-2">
        <Plus size={18} className="text-accent" />
        <span>Daftarkan Perangkat Ini</span>
      </h3>
      <p className="font-inter text-xs sm:text-sm text-textMain/70 mb-5">
        Perangkat ini akan didaftarkan sebagai autentikator resmi. Pastikan perangkat Anda memiliki sensor biometrik aktif.
      </p>

      <form onSubmit={handleRegisterDevice} className="space-y-4">
        <div>
          <label htmlFor="device-name" className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Nama Label Perangkat
          </label>
          <input
            id="device-name"
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Contoh: iPhone 15 Pro Max Raditya"
            required
            className="w-full max-w-lg px-4 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isRegistering || !deviceName.trim()}
          className="min-h-[48px] px-6 py-3 rounded-2xl bg-accent text-white font-poppins font-bold text-sm shadow-neu-out hover:brightness-110 active:brightness-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isRegistering ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Memindai Biometrik Perangkat...</span>
            </>
          ) : (
            <>
              <ScanFace size={18} />
              <span>Daftarkan Face ID / Windows Hello</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
