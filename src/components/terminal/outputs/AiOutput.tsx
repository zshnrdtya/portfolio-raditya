'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Loader2 } from 'lucide-react';

interface AiOutputProps {
  prompt: string;
}

export const AiOutput: React.FC<AiOutputProps> = ({ prompt }) => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function askZeera() {
      if (!prompt.trim()) {
        setResponse('Silakan sertakan pertanyaan setelah perintah. Contoh: ai ceritakan tentang proyek Raditya');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/zeera/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt }),
        });

        const data = await res.json();
        if (isMounted) {
          if (res.ok && data.reply) {
            setResponse(data.reply);
          } else {
            setResponse(data.error || 'Zeera AI sedang tidak dapat menjawab pertanyaan ini.');
          }
        }
      } catch {
        if (isMounted) {
          setResponse('Terjadi kendala koneksi saat menghubungi Zeera AI.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    askZeera();
    return () => {
      isMounted = false;
    };
  }, [prompt]);

  return (
    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs sm:text-sm font-mono">
      <div className="flex items-center gap-2 text-sky-400">
        <Bot size={16} />
        <span className="font-bold">Zeera AI Assistant:</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-400 py-2">
          <Loader2 size={14} className="animate-spin text-emerald-400" />
          <span>Sedang menganalisis jawaban dengan Gemini AI...</span>
        </div>
      ) : (
        <p className="text-slate-200 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line pl-6 border-l-2 border-sky-500/50">
          {response}
        </p>
      )}
    </div>
  );
};
