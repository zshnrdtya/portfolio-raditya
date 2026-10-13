'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Reply, Check, X, RefreshCw } from 'lucide-react';
import { PendingMessage } from '../types';

interface AdminMessageCardProps {
  message: PendingMessage;
  isProcessing: boolean;
  actionLoadingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  formatDate: (dateStr: string) => string;
}

export const AdminMessageCard: React.FC<AdminMessageCardProps> = ({
  message,
  isProcessing,
  actionLoadingId,
  onApprove,
  onReject,
  formatDate,
}) => {
  const isReply = !!message.parentId;
  const isThisCardLoading = actionLoadingId === message.id;

  return (
    <article className="bg-surface shadow-neu-out rounded-3xl p-5 sm:p-6 transition-all border border-white/30 space-y-4">
      {/* Header Row: Author Info & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {message.avatar_url ? (
            <Image
              src={message.avatar_url}
              alt={message.author_name}
              width={44}
              height={44}
              className="w-11 h-11 rounded-2xl object-cover bg-surface shadow-neu-in border border-accent/20 shrink-0"
            />
          ) : (
            <div
              aria-label={`Avatar inisial ${message.author_name}`}
              className="w-11 h-11 rounded-2xl bg-surface shadow-neu-in flex items-center justify-center text-accent font-poppins font-bold text-sm shrink-0"
            >
              {message.author_name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold font-poppins text-textMain truncate">
                {message.author_name}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold ${
                  isReply
                    ? 'bg-surface shadow-neu-in text-textMain'
                    : 'bg-surface shadow-neu-in text-accent'
                }`}
              >
                {isReply ? 'Balasan Diskusi' : 'Komentar Utama'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-textMain/85 text-[11px] sm:text-xs mt-0.5">
              <Clock size={12} />
              <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Context for Reply */}
      {isReply && message.parent && (
        <div className="bg-surface shadow-neu-in rounded-2xl p-3 sm:p-3.5 border-l-4 border-accent text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-accent mb-0.5">
            <Reply size={13} />
            <span>Menanggapi komentar dari:</span>
          </div>
          <p className="text-textMain/85 font-medium pl-4">
            {message.parent.author_name}
          </p>
        </div>
      )}

      {/* Message Body */}
      <div className="bg-surface shadow-neu-in rounded-2xl p-4 text-xs sm:text-sm font-inter text-textMain leading-relaxed break-words">
        {message.body}
      </div>

      {/* Moderation Actions */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onApprove(message.id)}
          disabled={isProcessing}
          aria-label={`Setujui pesan dari ${message.author_name}`}
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-accent text-white shadow-neu-out hover:opacity-95 active:shadow-neu-in text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {isThisCardLoading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          <span>Setujui</span>
        </button>

        <button
          type="button"
          onClick={() => onReject(message.id)}
          disabled={isProcessing}
          aria-label={`Tolak pesan dari ${message.author_name}`}
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-surface text-[#991B1B] border-2 border-[#991B1B]/40 shadow-neu-out hover:bg-[#991B1B]/10 active:shadow-neu-in text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#991B1B] focus-visible:outline-none"
        >
          <X size={14} />
          <span>Tolak</span>
        </button>
      </div>
    </article>
  );
};
