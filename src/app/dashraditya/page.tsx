'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { PendingMessage, FilterType, ToastState, DashboardTab, ProjectItem } from './types';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopNav } from './components/AdminTopNav';
import { AdminToast } from './components/AdminToast';
import { AdminProjectsTab } from './components/AdminProjectsTab';
import { AdminGuestbookTab } from './components/AdminGuestbookTab';
import { AdminSecurityTab } from './components/AdminSecurityTab';
import { AdminLoginForm } from './components/AdminLoginForm';

const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<DashboardTab>('PROJECTS');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Guestbook state
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchPending = useCallback(async () => {
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        const errData = await res.json().catch(() => null);
        setErrorMessage(errData?.error || 'Gagal memuat pesan dari server.');
      }
    } catch {
      setErrorMessage('Terjadi kendala koneksi saat menghubungi server.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        showToast('Gagal memuat daftar proyek dari server.', 'error');
      }
    } catch {
      showToast('Koneksi terputus saat memuat proyek.', 'error');
    } finally {
      setIsLoadingProjects(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    if (status !== 'authenticated' || session?.user?.email !== ADMIN_EMAIL) {
      return;
    }

    async function loadInitialData() {
      setIsLoadingMessages(true);
      setIsLoadingProjects(true);
      setErrorMessage(null);
      try {
        const [guestbookRes, projectsRes] = await Promise.all([
          fetch('/api/admin/guestbook'),
          fetch('/api/admin/projects'),
        ]);

        if (guestbookRes.ok) {
          const gbData = await guestbookRes.json();
          if (isMounted) setMessages(gbData);
        }

        if (projectsRes.ok) {
          const projData = await projectsRes.json();
          if (isMounted) setProjects(projData);
        }
      } catch {
        if (isMounted) setErrorMessage('Terjadi kendala koneksi saat menghubungi server.');
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
          setIsLoadingProjects(false);
        }
      }
    }

    loadInitialData();
    return () => { isMounted = false; };
  }, [status, session]);

  const handleAction = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast(
          newStatus === 'APPROVED' ? 'Pesan berhasil disetujui.' : 'Pesan berhasil ditolak.'
        );
      } else {
        showToast('Gagal memproses pesan.', 'error');
      }
    } catch {
      showToast('Terjadi kendala jaringan.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchApprove = async (batchMessages: PendingMessage[]) => {
    if (batchMessages.length === 0) return;
    setIsBatchProcessing(true);
    try {
      const results = await Promise.allSettled(
        batchMessages.map((msg) =>
          fetch('/api/admin/guestbook', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: msg.id, status: 'APPROVED' }),
          })
        )
      );
      const successfulIds = batchMessages
        .filter((_, idx) => results[idx].status === 'fulfilled')
        .map((m) => m.id);

      setMessages((prev) => prev.filter((m) => !successfulIds.includes(m.id)));
      setShowBatchConfirm(false);
      showToast(`${successfulIds.length} pesan berhasil disetujui.`);
    } catch {
      showToast('Terjadi kendala saat menyetujui pesan.', 'error');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = useMemo(() => messages.length, [messages]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-surface shadow-neu-out flex items-center justify-center text-accent animate-pulse">
          <Loader2 size={24} className="animate-spin" />
        </div>
        <p className="font-poppins font-medium text-xs text-textMain/70 mt-3">
          Memuat sesi administrator...
        </p>
      </main>
    );
  }

  if (status === 'unauthenticated' || session?.user?.email !== ADMIN_EMAIL) {
    return <AdminLoginForm currentSession={session} />;
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop & Mobile Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isLoading={isLoadingMessages || isLoadingProjects}
        isBatchProcessing={isBatchProcessing}
        onRefresh={() => {
          fetchPending();
          fetchProjects();
        }}
        pendingGuestbookCount={pendingCount}
        totalProjectsCount={projects.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <AdminTopNav
            activeTab={activeTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            isLoading={isLoadingMessages || isLoadingProjects}
            isBatchProcessing={isBatchProcessing}
            onRefresh={() => {
              fetchPending();
              fetchProjects();
            }}
            onAddNewProject={() => {
              setProjectToEdit(null);
              setIsProjectModalOpen(true);
            }}
          />

          {activeTab === 'PROJECTS' ? (
            <AdminProjectsTab
              projects={projects}
              isLoading={isLoadingProjects}
              onRefresh={fetchProjects}
              showToast={showToast}
              isModalOpen={isProjectModalOpen}
              setIsModalOpen={setIsProjectModalOpen}
              projectToEdit={projectToEdit}
              setProjectToEdit={setProjectToEdit}
            />
          ) : activeTab === 'GUESTBOOK' ? (
            <AdminGuestbookTab
              messages={messages}
              isLoading={isLoadingMessages}
              errorMessage={errorMessage}
              actionLoading={actionLoading}
              isBatchProcessing={isBatchProcessing}
              filterType={filterType}
              searchQuery={searchQuery}
              showBatchConfirm={showBatchConfirm}
              onAction={handleAction}
              onBatchApprove={handleBatchApprove}
              onFilterChange={setFilterType}
              onSearchChange={setSearchQuery}
              onOpenBatchConfirm={() => setShowBatchConfirm(true)}
              onCloseBatchConfirm={() => setShowBatchConfirm(false)}
              onResetFilter={() => { setFilterType('ALL'); setSearchQuery(''); }}
              onRetry={fetchPending}
              formatDate={formatDate}
            />
          ) : (
            <AdminSecurityTab onShowToast={showToast} />
          )}

          <AdminToast toast={toast} onClose={() => setToast(null)} />
        </div>
      </main>
    </div>
  );
}
