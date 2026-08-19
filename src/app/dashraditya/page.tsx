'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, User, RefreshCw, ArrowLeft, Reply } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PendingMessage {
  id: string;
  body: string;
  author_name: string;
  avatar_url: string | null;
  createdAt: string;
  parentId: string | null;
  parent?: {
    author_name: string;
  } | null;
}

type FilterType = 'ALL' | 'MAIN' | 'REPLIES';

export default function AdminGuestbookPage() {
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('ALL');

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else if (res.status === 401) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Failed to fetch pending:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast(
          status === 'APPROVED'
            ? '✅ Pesan berhasil disetujui.'
            : '🗑️ Pesan ditolak.'
        );
      } else {
        showToast('❌ Gagal memproses pesan.');
      }
    } catch {
      showToast('❌ Terjadi kesalahan jaringan.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterType === 'MAIN') return !msg.parentId;
    if (filterType === 'REPLIES') return !!msg.parentId;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-surface shadow-neu-out flex items-center justify-center hover:shadow-neu-in transition-shadow"
            >
              <ArrowLeft size={16} className="text-textMain" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-poppins text-textMain">
                Moderasi Buku Tamu
              </h1>
              <p className="text-xs text-textMain/50 mt-0.5">
                {messages.length} pesan menunggu persetujuan
              </p>
            </div>
          </div>

          <button
            onClick={fetchPending}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface shadow-neu-out rounded-full text-textMain/70 hover:shadow-neu-in transition-shadow cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        {messages.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'ALL'
                  ? 'bg-accent text-white shadow-neu-in'
                  : 'bg-surface text-textMain/70 shadow-neu-out hover:shadow-neu-in'
              }`}
            >
              Semua Pesan
            </button>
            <button
              onClick={() => setFilterType('MAIN')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'MAIN'
                  ? 'bg-accent text-white shadow-neu-in'
                  : 'bg-surface text-textMain/70 shadow-neu-out hover:shadow-neu-in'
              }`}
            >
              Komentar Utama Saja
            </button>
            <button
              onClick={() => setFilterType('REPLIES')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === 'REPLIES'
                  ? 'bg-accent text-white shadow-neu-in'
                  : 'bg-surface text-textMain/70 shadow-neu-out hover:shadow-neu-in'
              }`}
            >
              Balasan Saja
            </button>
          </div>
        )}

        {/* Messages */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface shadow-neu-out rounded-2xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-surface shadow-neu-in" />
                  <div className="h-3 w-28 rounded-full bg-surface shadow-neu-in" />
                </div>
                <div className="h-3 w-full rounded-full bg-surface shadow-neu-in mb-2" />
                <div className="h-3 w-1/2 rounded-full bg-surface shadow-neu-in" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <Check size={48} className="mx-auto mb-4 text-accent opacity-40" />
            <p className="text-textMain/50 font-medium">
              Semua pesan sudah dimoderasi! 🎉
            </p>
            <p className="text-xs text-textMain/30 mt-1">
              Tidak ada pesan pending saat ini.
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-textMain/50 font-medium">
              Tidak ada pesan pada kategori ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-surface shadow-neu-out rounded-2xl p-5"
              >
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-3">
                  {msg.avatar_url ? (
                    <Image
                      src={msg.avatar_url}
                      alt={msg.author_name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-accent/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <User size={14} className="text-accent" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-textMain truncate">
                      {msg.author_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-textMain/35 shrink-0">
                    <Clock size={11} />
                    <span className="text-[11px]">{formatDate(msg.createdAt)}</span>
                  </div>
                </div>

                {/* Reply Context */}
                {msg.parentId && msg.parent && (
                  <div className="flex items-center gap-1.5 bg-surface shadow-neu-in rounded-lg px-3 py-1.5 mb-3 w-fit ml-11">
                    <Reply size={12} className="text-accent" />
                    <span className="text-[11px] font-medium text-textMain/70">
                      Balasan untuk <strong className="text-textMain">{msg.parent.author_name}</strong>
                    </span>
                  </div>
                )}

                {/* Body */}
                <p className="text-sm text-textMain/80 leading-relaxed pl-11 mb-4">
                  {msg.body}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pl-11">
                  <button
                    onClick={() => handleAction(msg.id, 'APPROVED')}
                    disabled={actionLoading === msg.id}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Check size={13} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(msg.id, 'REJECTED')}
                    disabled={actionLoading === msg.id}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium max-w-[90vw]">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
