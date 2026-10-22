'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Abaikan tracking jika sedang berada di dashboard admin (/dashraditya)
    if (pathname.startsWith('/dashraditya')) {
      return;
    }

    // Inisialisasi atau ambil session ID dari sessionStorage
    let sessionId = '';
    try {
      sessionId = sessionStorage.getItem('rad_vid') || '';
      if (!sessionId) {
        sessionId = `v_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
        sessionStorage.setItem('rad_vid', sessionId);
      }
    } catch {
      sessionId = `anon_${Date.now()}`;
    }

    const sendPing = () => {
      try {
        const payload = JSON.stringify({
          sessionId,
          path: pathname || '/',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        });

        if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
          navigator.sendBeacon('/api/telemetry/ping', payload);
        } else {
          fetch('/api/telemetry/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Abaikan error jaringan beacon di background
      }
    };

    // Ping pertama saat mount
    sendPing();

    // Heartbeat berkala setiap 45 detik saat tab sedang dilihat
    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendPing();
      }
    }, 45000);

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname]);

  return null;
}
