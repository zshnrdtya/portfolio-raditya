'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';

interface GuestbookEntry {
  id: string;
  author_name: string;
  body: string;
  createdAt: string;
}

export const GuestbookOutput: React.FC = () => {
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGuestbook() {
      try {
        const res = await fetch('/api/guestbook');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setMessages(data.slice(0, 5));
          }
        }
      } catch {
        // Abaikan error jaringan
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGuestbook();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim() || !bodyText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: name.trim(),
          body: bodyText.trim(),
        }),
      });

      if (!res.ok) {
        setErrorMessage('Gagal mengirim pesan. Silakan coba sesaat lagi.');
        return;
      }

      setSubmitSuccess(true);
      setName('');
      setBodyText('');
    } catch {
      setErrorMessage('Terjadi kendala jaringan saat mengirim pesan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
        <span>Buku Tamu Pengunjung (Database Supabase):</span>
        {isLoading && <Loader2 size={14} className="animate-spin text-emerald-400" />}
      </div>

      {/* List Pesan Terbaru */}
      <div className="space-y-2">
        {messages.length === 0 && !isLoading ? (
          <p className="text-slate-500 font-mono text-xs p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            Belum ada pesan publik yang ditampilkan. Jadilah yang pertama mengisi buku tamu!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 font-mono"
            >
              <span className="text-emerald-400 mt-0.5">💬</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-200">{msg.author_name}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-slate-400 font-sans text-xs mt-0.5">{msg.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Tinggalkan Pesan */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="font-bold font-mono text-emerald-400 text-xs flex items-center gap-2">
          <MessageSquare size={14} />
          <span>Tinggalkan Jejak di Buku Tamu</span>
        </h4>

        {submitSuccess ? (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2 text-xs">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Pesan berhasil dikirim dan masuk ke antrean moderasi Raditya!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {errorMessage && (
              <p className="text-red-400 text-xs font-mono">{errorMessage}</p>
            )}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama atau alias Anda..."
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs outline-none focus:border-emerald-500 transition-colors"
            />
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Pesan, masukan, atau sapaan..."
              rows={2}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs outline-none focus:border-emerald-500 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !bodyText.trim()}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Kirim Pesan</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
