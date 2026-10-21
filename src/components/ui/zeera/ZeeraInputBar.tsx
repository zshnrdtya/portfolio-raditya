'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { QUICK_PROMPTS } from './types';

interface ZeeraInputBarProps {
  input: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (val: string) => void;
  onSubmit: (textToSend?: string) => void;
}

export const ZeeraInputBar: React.FC<ZeeraInputBarProps> = ({
  input,
  isLoading,
  inputRef,
  onInputChange,
  onSubmit,
}) => {
  return (
    <>
      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-black/5 bg-[var(--color-surface)]/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        {QUICK_PROMPTS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSubmit(chip.text)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] active:scale-95 text-[11px] font-poppins font-medium text-[var(--color-textMain)] border border-white/40 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-3 sm:p-4 border-t border-black/5 bg-[var(--color-surface)] flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Tanya Zeera AI tentang portofolio..."
            disabled={isLoading}
            className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] border border-white/40 text-xs sm:text-sm font-inter text-[var(--color-textMain)] placeholder:text-[var(--color-textMain)]/50 focus:outline-none focus:ring-2 focus:ring-[#136846]/40 disabled:opacity-60 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] active:scale-95 flex items-center justify-center text-[#136846] border border-white/40 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
          aria-label="Kirim Pesan"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </>
  );
};
