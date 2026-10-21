'use client';

import React from 'react';
import { Loader2, Sparkles, ArrowUpRight } from 'lucide-react';
import { ZeeraMessage } from './types';

interface ZeeraMessageListProps {
  messages: ZeeraMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onTriggerAction: (action: NonNullable<ZeeraMessage['action']>) => void;
}

export const ZeeraMessageList: React.FC<ZeeraMessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  onTriggerAction,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col ${
            msg.role === 'user' ? 'items-end' : 'items-start'
          }`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm font-inter leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#136846] text-white shadow-md rounded-tr-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] border border-white/50 rounded-tl-sm'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>

          {/* Interactive Action Pill if triggered */}
          {msg.action && (
            <button
              onClick={() => onTriggerAction(msg.action!)}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] border border-white/40 text-[11px] font-poppins font-semibold text-[#136846] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#136846]" />
              <span>
                {msg.action.type === 'navigate'
                  ? `📍 Menuju ke bagian #${msg.action.payload.section}`
                  : '✉️ Draf pesan kontak disiapkan'}
              </span>
              <ArrowUpRight className="w-3 h-3 text-[#136846]" />
            </button>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] border border-white/40 w-fit">
          <Loader2 className="w-4 h-4 animate-spin text-[#136846]" />
          <span className="text-xs font-inter text-[var(--color-textMain)] opacity-80">
            Zeera AI sedang berpikir...
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
