'use client';

import React, { useMemo } from 'react';
import { PendingMessage, FilterType } from '../types';
import { AdminMetrics } from './AdminMetrics';
import { AdminFilterBar } from './AdminFilterBar';
import { AdminBatchModal } from './AdminBatchModal';
import {
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
  AdminFilteredEmptyState,
} from './AdminStates';
import { AdminMessageCard } from './AdminMessageCard';

interface AdminGuestbookTabProps {
  messages: PendingMessage[];
  isLoading: boolean;
  errorMessage: string | null;
  actionLoading: string | null;
  isBatchProcessing: boolean;
  filterType: FilterType;
  searchQuery: string;
  showBatchConfirm: boolean;
  onAction: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onBatchApprove: (messages: PendingMessage[]) => void;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  onOpenBatchConfirm: () => void;
  onCloseBatchConfirm: () => void;
  onResetFilter: () => void;
  onRetry: () => void;
  formatDate: (dateStr: string) => string;
}

export function AdminGuestbookTab({
  messages,
  isLoading,
  errorMessage,
  actionLoading,
  isBatchProcessing,
  filterType,
  searchQuery,
  showBatchConfirm,
  onAction,
  onBatchApprove,
  onFilterChange,
  onSearchChange,
  onOpenBatchConfirm,
  onCloseBatchConfirm,
  onResetFilter,
  onRetry,
  formatDate,
}: AdminGuestbookTabProps) {
  const mainCount = useMemo(() => messages.filter((m) => !m.parentId).length, [messages]);
  const repliesCount = useMemo(() => messages.filter((m) => !!m.parentId).length, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchFilter =
        filterType === 'ALL' ? true : filterType === 'MAIN' ? !msg.parentId : !!msg.parentId;

      if (!matchFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        msg.author_name.toLowerCase().includes(q) ||
        msg.body.toLowerCase().includes(q) ||
        (msg.parent?.author_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [messages, filterType, searchQuery]);

  return (
    <>
      <AdminMetrics
        totalCount={messages.length}
        mainCount={mainCount}
        repliesCount={repliesCount}
        filterType={filterType}
        onSelectFilter={onFilterChange}
      />

      {messages.length > 0 && (
        <AdminFilterBar
          totalCount={messages.length}
          mainCount={mainCount}
          repliesCount={repliesCount}
          filterType={filterType}
          searchQuery={searchQuery}
          hasFilteredMessages={filteredMessages.length > 0}
          isBatchProcessing={isBatchProcessing}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onOpenBatchConfirm={onOpenBatchConfirm}
        />
      )}

      <AdminBatchModal
        isOpen={showBatchConfirm}
        count={filteredMessages.length}
        isProcessing={isBatchProcessing}
        onClose={onCloseBatchConfirm}
        onConfirm={() => onBatchApprove(filteredMessages)}
      />

      {isLoading ? (
        <AdminLoadingState />
      ) : errorMessage ? (
        <AdminErrorState errorMessage={errorMessage} onRetry={onRetry} />
      ) : messages.length === 0 ? (
        <AdminEmptyState />
      ) : filteredMessages.length === 0 ? (
        <AdminFilteredEmptyState onReset={onResetFilter} />
      ) : (
        <section aria-label="Daftar pesan pending" className="space-y-4 sm:space-y-5">
          {filteredMessages.map((msg) => (
            <AdminMessageCard
              key={msg.id}
              message={msg}
              isProcessing={actionLoading === msg.id || isBatchProcessing}
              actionLoadingId={actionLoading}
              onApprove={(id) => onAction(id, 'APPROVED')}
              onReject={(id) => onAction(id, 'REJECTED')}
              formatDate={formatDate}
            />
          ))}
        </section>
      )}
    </>
  );
}
