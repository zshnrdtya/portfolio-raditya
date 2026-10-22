'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  DEFAULT_SITE_CONTENT,
  SectionKey,
  SiteContentMap,
} from '@/lib/siteContent';

const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';

interface SiteContentContextType {
  content: SiteContentMap;
  isLoading: boolean;
  isEditMode: boolean;
  setIsEditMode: (active: boolean | ((prev: boolean) => boolean)) => void;
  isAdmin: boolean;
  editingSection: SectionKey | null;
  openEditModal: (section: SectionKey) => void;
  closeEditModal: () => void;
  saveSectionContent: (section: SectionKey, data: unknown) => Promise<void>;
  toastMessage: string | null;
  clearToast: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const [content, setContent] = useState<SiteContentMap>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Memuat konten live dari database
  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setContent(data);
          }
        }
      } catch (err) {
        console.warn('[SiteContentProvider] Gagal memuat konten dari server:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const openEditModal = useCallback((section: SectionKey) => {
    setEditingSection(section);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingSection(null);
  }, []);

  const saveSectionContent = useCallback(
    async (section: SectionKey, data: unknown) => {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Gagal menyimpan konten section.');
      }

      // Live update state lokal
      setContent((prev) => ({
        ...prev,
        [section]: data as never,
      }));

      closeEditModal();
      showToast(`Konten ${section.toUpperCase()} berhasil diperbarui.`);
    },
    [closeEditModal, showToast]
  );

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isLoading,
        isEditMode,
        setIsEditMode,
        isAdmin,
        editingSection,
        openEditModal,
        closeEditModal,
        saveSectionContent,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent harus digunakan di dalam SiteContentProvider.');
  }
  return context;
}
