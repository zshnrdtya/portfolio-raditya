'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { AdminLoginForm } from '../components/AdminLoginForm';

const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email === ADMIN_EMAIL) {
      router.replace('/dashraditya');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-surface shadow-neu-out flex items-center justify-center text-accent animate-pulse">
          <Loader2 size={24} className="animate-spin" />
        </div>
        <p className="font-poppins font-medium text-xs text-textMain/70 mt-3">
          Memuat sesi administrator...
        </p>
      </main>
    );
  }

  return <AdminLoginForm currentSession={session} />;
}
