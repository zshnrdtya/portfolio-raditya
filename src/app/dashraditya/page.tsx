'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PendingMessage, FilterType, ToastState } from './types';
import { AdminHeader } from './components/AdminHeader';
import { AdminMetrics } from './components/AdminMetrics';
import { AdminFilterBar } from './components/AdminFilterBar';
import { AdminMessageCard } from './components/AdminMessageCard';
import {
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
  AdminFilteredEmptyState,
} from './components/AdminStates';
import { AdminBatchModal } from './components/AdminBatchModal';
import { AdminToast } from './components/AdminToast';

export default function AdminGuestbookPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else if (res.status === 401) {
        router.replace('/');
      } else {
        const errData = await res.json().catch(() => null);
        setErrorMessage(errData?.error || 'Gagal memuat pesan dari server.');
      }
    } catch {
      setErrorMessage('Terjadi kendala koneksi saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/guestbook');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setMessages(data);
            setErrorMessage(null);
          }
        } else if (res.status === 401) {
          router.replace('/');
        } else {
          const errData = await res.json().catch(() => null);
          if (!ignore) {
            setErrorMessage(errData?.error || 'Gagal memuat pesan dari server.');
          }
        }
      } catch {
        if (!ignore) {
          setErrorMessage('Terjadi kendala koneksi saat menghubungi server.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
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
            ? 'Pesan berhasil disetujui dan diterbitkan.'
            : 'Pesan berhasil ditolak.',
          'success'
        );
      } else {
        showToast('Gagal memperbarui status pesan.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan saat memproses aksi.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchApprove = async (targetMessages: PendingMessage[]) => {
    if (targetMessages.length === 0) return;
    setIsBatchProcessing(true);
    setShowBatchConfirm(false);

    let successCount = 0;
    const failedIds: string[] = [];

    for (const msg of targetMessages) {
      try {
        const res = await fetch('/api/admin/guestbook', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, status: 'APPROVED' }),
        });
        if (res.ok) {
          successCount++;
          setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        } else {
          failedIds.push(msg.id);
        }
      } catch {
        failedIds.push(msg.id);
      }
    }

    setIsBatchProcessing(false);
    if (successCount > 0) {
      showToast(`${successCount} pesan berhasil disetujui sekaligus.`, 'success');
    }
    if (failedIds.length > 0) {
      showToast(`${failedIds.length} pesan mengalami kegagalan proses.`, 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const mainMessagesCount = useMemo(
    () => messages.filter((m) => !m.parentId).length,
    [messages]
  );
  const repliesCount = useMemo(
    () => messages.filter((m) => !!m.parentId).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchFilter =
        filterType === 'ALL'
          ? true
          : filterType === 'MAIN'
          ? !msg.parentId
          : !!msg.parentId;

      if (!matchFilter) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchAuthor = msg.author_name.toLowerCase().includes(q);
      const matchBody = msg.body.toLowerCase().includes(q);
      const matchParent = msg.parent?.author_name
        ? msg.parent.author_name.toLowerCase().includes(q)
        : false;

      return matchAuthor || matchBody || matchParent;
    });
  }, [messages, filterType, searchQuery]);

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-textMain selection:bg-accent/20">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <AdminHeader
          isLoading={isLoading}
          isBatchProcessing={isBatchProcessing}
          onRefresh={fetchPending}
        />

        <AdminMetrics
          totalCount={messages.length}
          mainCount={mainMessagesCount}
          repliesCount={repliesCount}
          filterType={filterType}
          onSelectFilter={setFilterType}
        />

        {messages.length > 0 && (
          <AdminFilterBar
            totalCount={messages.length}
            mainCount={mainMessagesCount}
            repliesCount={repliesCount}
            filterType={filterType}
            searchQuery={searchQuery}
            hasFilteredMessages={filteredMessages.length > 0}
            isBatchProcessing={isBatchProcessing}
            onFilterChange={setFilterType}
            onSearchChange={setSearchQuery}
            onOpenBatchConfirm={() => setShowBatchConfirm(true)}
          />
        )}

        <AdminBatchModal
          isOpen={showBatchConfirm}
          count={filteredMessages.length}
          isProcessing={isBatchProcessing}
          onClose={() => setShowBatchConfirm(false)}
          onConfirm={() => handleBatchApprove(filteredMessages)}
        />

        {isLoading ? (
          <AdminLoadingState />
        ) : errorMessage ? (
          <AdminErrorState
            errorMessage={errorMessage}
            onRetry={fetchPending}
          />
        ) : messages.length === 0 ? (
          <AdminEmptyState />
        ) : filteredMessages.length === 0 ? (
          <AdminFilteredEmptyState
            onReset={() => {
              setFilterType('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <section aria-label="Daftar pesan pending" className="space-y-4 sm:space-y-5">
            {filteredMessages.map((msg) => (
              <AdminMessageCard
                key={msg.id}
                message={msg}
                isProcessing={actionLoading === msg.id || isBatchProcessing}
                actionLoadingId={actionLoading}
                onApprove={(id) => handleAction(id, 'APPROVED')}
                onReject={(id) => handleAction(id, 'REJECTED')}
                formatDate={formatDate}
              />
            ))}
          </section>
        )}

        <AdminToast
          toast={toast}
          onClose={() => setToast(null)}
        />
      </div>
    </main>
  );
}
