'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ScanFace, Loader2, ShieldCheck } from 'lucide-react';
import { startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser';

interface BiometricLoginButtonProps {
  onErrorMessage: (msg: string | null) => void;
  disabled?: boolean;
}

const emptySubscribe = () => () => {};

export const BiometricLoginButton: React.FC<BiometricLoginButtonProps> = ({
  onErrorMessage,
  disabled = false,
}) => {
  const router = useRouter();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isSupported = isClient ? browserSupportsWebAuthn() : true;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBiometricLogin = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    onErrorMessage(null);

    try {
      // 1. Ambil opsi autentikasi dari server
      const optRes = await fetch('/api/auth/passkey/login-options');
      const optData = await optRes.json();

      if (!optRes.ok) {
        onErrorMessage(optData.error || 'Gagal memulai verifikasi Face ID.');
        setIsLoading(false);
        return;
      }

      if (!optData.hasCredentials) {
        onErrorMessage(
          'Belum ada perangkat Face ID yang didaftarkan. Silakan masuk dengan kata sandi, lalu daftarkan perangkat Anda di menu Keamanan.'
        );
        setIsLoading(false);
        return;
      }

      // 2. Buka prompt biometrik native browser (Face ID / Windows Hello)
      let authResponse;
      try {
        authResponse = await startAuthentication(optData.options);
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'NotAllowedError') {
          onErrorMessage('Pemindaian biometrik dibatalkan oleh pengguna.');
        } else {
          onErrorMessage(error.message || 'Gagal memverifikasi biometrik pada perangkat ini.');
        }
        setIsLoading(false);
        return;
      }

      // 3. Verifikasi hasil pemindaian di server
      const verifyRes = await fetch('/api/auth/passkey/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: authResponse }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified || !verifyData.ticket) {
        onErrorMessage(verifyData.error || 'Verifikasi Face ID tidak berhasil.');
        setIsLoading(false);
        return;
      }

      // 4. Masuk ke sesi NextAuth menggunakan tiket one-time
      setIsSuccess(true);
      const signInRes = await signIn('passkey', {
        ticket: verifyData.ticket,
        redirect: false,
      });

      if (signInRes?.error) {
        onErrorMessage('Gagal membuka sesi administrator.');
        setIsLoading(false);
        setIsSuccess(false);
        return;
      }

      // Redirect ke dashboard
      router.replace('/dashraditya');
      router.refresh();
    } catch (err) {
      console.error('Error saat login biometrik:', err);
      onErrorMessage('Terjadi kendala saat menghubungkan ke sensor biometrik.');
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleBiometricLogin}
      disabled={isLoading || disabled}
      aria-label="Masuk dengan Face ID atau Biometrik Perangkat"
      className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-surface text-textMain font-poppins font-bold text-sm shadow-neu-out hover:shadow-neu-in active:shadow-neu-in focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/60 mb-3"
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin text-accent" />
          <span>Memindai Biometrik...</span>
        </>
      ) : isSuccess ? (
        <>
          <ShieldCheck size={18} className="text-emerald-700" />
          <span className="text-emerald-800 font-bold">Terverifikasi! Mengalihkan...</span>
        </>
      ) : (
        <>
          <ScanFace size={18} className="text-accent" />
          <span>Masuk dengan Face ID / Biometrik</span>
        </>
      )}
    </button>
  );
};
