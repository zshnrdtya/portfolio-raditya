'use client';

import React, { useRef, useEffect } from 'react';
import { TERMINAL_COMMANDS_LIST } from '@/data/portfolioData';

interface TerminalPromptProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onNavigateHistory: (direction: 'up' | 'down') => void;
  disabled?: boolean;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  input,
  setInput,
  onSubmit,
  onNavigateHistory,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus otomatis saat komponen dimuat
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete perintah
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;
      const matched = TERMINAL_COMMANDS_LIST.find((c) =>
        c.command.startsWith(trimmed)
      );
      if (matched) {
        setInput(matched.command);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 font-mono text-xs sm:text-sm pt-2">
      <span className="text-emerald-400 font-bold shrink-0">
        guest@raditya:~$
      </span>

      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Ketik perintah (contoh: help, projects)..."
          className="w-full bg-transparent text-slate-100 outline-none border-none p-0 font-mono text-xs sm:text-sm placeholder:text-slate-600 focus:ring-0"
        />
      </div>
    </form>
  );
};
