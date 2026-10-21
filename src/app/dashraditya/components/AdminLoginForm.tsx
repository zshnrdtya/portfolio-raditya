'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import type { Session } from 'next-auth';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

interface AdminLoginFormProps {
  currentSession?: Session | null;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ currentSession }) => {
  const [email, setEmail] = useState('radityaraizeeshan@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isUnauthorizedUser =
    currentSession?.user?.email &&
    currentSession.user.email !== 'radityaraizeeshan@gmail.com';

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isGithubLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setErrorMessage('Email atau kata sandi tidak sesuai. Silakan periksa kembali.');
        setIsLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setErrorMessage('Terjadi kendala jaringan saat menghubungkan ke sistem autentikasi.');
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    if (isLoading || isGithubLoading) return;
    setIsGithubLoading(true);
    setErrorMessage(null);
    try {
      await signIn('github', { redirectTo: '/dashraditya' });
    } catch {
      setErrorMessage('Gagal membuka halaman autentikasi GitHub.');
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12">
      {/* Return link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-poppins text-textMain/80 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg py-1.5 px-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-surface rounded-3xl p-7 sm:p-9 shadow-neu-out border border-white/60">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-surface shadow-neu-out flex items-center justify-center text-accent mb-3.5 border border-white/50">
            <Lock size={24} />
          </div>
          <h1 className="font-poppins font-bold text-xl sm:text-2xl text-textMain tracking-tight">
            Masuk ke Dashraditya
          </h1>
          <p className="font-inter text-xs sm:text-sm text-textMain/75 mt-1">
            Portal administrasi portofolio Raditya Rai Zeeshan
          </p>
        </div>

        {/* Unauthorized GitHub Account Notice */}
        {isUnauthorizedUser && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-2xl bg-amber-100 text-amber-950 text-xs sm:text-sm font-medium border border-amber-300 shadow-neu-in flex items-start gap-2.5"
          >
            <ShieldAlert size={18} className="text-amber-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Akses Ditolak</p>
              <p className="mt-0.5">
                Akun ({currentSession?.user?.email}) bukan akun administrator. Silakan keluar dan masuk dengan akun terdaftar.
              </p>
              <button
                type="button"
                onClick={() => signOut()}
                className="mt-2 text-xs font-bold text-accent underline cursor-pointer hover:opacity-80"
              >
                Keluar dari akun saat ini
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-2xl bg-red-100 text-red-900 text-xs sm:text-sm font-medium border border-red-300 shadow-neu-in"
          >
            {errorMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5"
            >
              Email Administrator
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-textMain/55"
              />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-textMain/55"
              />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin"
                required
                className="w-full pl-11 pr-12 py-3 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="w-10 h-10 absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-textMain/60 hover:text-textMain cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGithubLoading || !password}
            className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-accent text-white font-poppins font-bold text-sm shadow-neu-out hover:brightness-110 active:brightness-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-textMain/15" />
          </div>
          <span className="relative px-3 bg-surface font-inter text-xs text-textMain/65 font-medium uppercase tracking-wider">
            atau
          </span>
        </div>

        {/* Sign in with GitHub */}
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={isLoading || isGithubLoading}
          className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-surface text-textMain font-poppins font-bold text-sm shadow-neu-out hover:shadow-neu-in active:shadow-neu-in focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/50"
        >
          {isGithubLoading ? (
            <>
              <Loader2 size={16} className="animate-spin text-accent" />
              <span>Menghubungkan GitHub...</span>
            </>
          ) : (
            <>
              <GithubIcon size={18} />
              <span>Masuk dengan GitHub</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
