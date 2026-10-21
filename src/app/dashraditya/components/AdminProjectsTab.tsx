'use client';

import React, { useState, useMemo } from 'react';
import { ProjectItem } from '../types';
import { AdminProjectCard } from './AdminProjectCard';
import { AdminProjectModal } from './AdminProjectModal';
import { AdminProjectDeleteModal } from './AdminProjectDeleteModal';
import { FolderGit2, Search, Plus, Layers, Eye, EyeOff } from 'lucide-react';

interface AdminProjectsTabProps {
  projects: ProjectItem[];
  isLoading: boolean;
  onRefresh: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  projectToEdit: ProjectItem | null;
  setProjectToEdit: (project: ProjectItem | null) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  projects,
  isLoading,
  onRefresh,
  showToast,
  isModalOpen,
  setIsModalOpen,
  projectToEdit,
  setProjectToEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublish, setFilterPublish] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Metrik proyek
  const publishedCount = useMemo(
    () => projects.filter((p) => p.published).length,
    [projects]
  );
  const draftCount = useMemo(
    () => projects.filter((p) => !p.published).length,
    [projects]
  );

  // Filter daftar proyek
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filterPublish === 'PUBLISHED' && !p.published) return false;
      if (filterPublish === 'DRAFT' && p.published) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTech = p.techStack.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchTech;
    });
  }, [projects, filterPublish, searchQuery]);

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: ProjectItem) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (data: Partial<ProjectItem>) => {
    const isEdit = !!data.id;
    const url = '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Gagal menyimpan proyek.');
    }

    showToast(
      isEdit ? 'Data proyek berhasil diperbarui.' : 'Proyek baru berhasil ditambahkan.',
      'success'
    );
    onRefresh();
  };

  const handleTogglePublish = async (project: ProjectItem) => {
    setActionLoadingId(project.id);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          published: !project.published,
        }),
      });

      if (res.ok) {
        showToast(
          !project.published
            ? `Proyek "${project.title}" kini tampil di publik.`
            : `Proyek "${project.title}" dijadikan draf.`,
          'success'
        );
        onRefresh();
      } else {
        showToast('Gagal mengubah status publikasi proyek.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast(`Proyek "${projectToDelete.title}" berhasil dihapus.`, 'success');
        setProjectToDelete(null);
        onRefresh();
      } else {
        showToast('Gagal menghapus proyek.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan saat menghapus proyek.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setFilterPublish('ALL')}
          className={`p-4 rounded-2xl transition-all text-left cursor-pointer ${
            filterPublish === 'ALL'
              ? 'bg-surface shadow-neu-in border border-accent/20'
              : 'bg-surface shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          <div className="flex items-center justify-between text-textMain/75 mb-1">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider">
              Total Proyek
            </span>
            <Layers size={18} className="text-accent" />
          </div>
          <p className="font-poppins font-black text-2xl text-textMain">{projects.length}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterPublish('PUBLISHED')}
          className={`p-4 rounded-2xl transition-all text-left cursor-pointer ${
            filterPublish === 'PUBLISHED'
              ? 'bg-surface shadow-neu-in border border-accent/20'
              : 'bg-surface shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          <div className="flex items-center justify-between text-textMain/75 mb-1">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider">
              Ditampilkan (Publik)
            </span>
            <Eye size={18} className="text-accent" />
          </div>
          <p className="font-poppins font-black text-2xl text-accent">{publishedCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterPublish('DRAFT')}
          className={`p-4 rounded-2xl transition-all text-left cursor-pointer ${
            filterPublish === 'DRAFT'
              ? 'bg-surface shadow-neu-in border border-amber-800/20'
              : 'bg-surface shadow-neu-out hover:shadow-neu-in'
          }`}
        >
          <div className="flex items-center justify-between text-textMain/75 mb-1">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider">
              Draf (Sembunyi)
            </span>
            <EyeOff size={18} className="text-amber-800" />
          </div>
          <p className="font-poppins font-black text-2xl text-amber-800">{draftCount}</p>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMain/60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, teknologi, atau deskripsi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-xs sm:text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="min-h-[42px] px-5 py-2 rounded-full bg-accent text-white font-poppins font-bold text-xs shadow-neu-out hover:brightness-110 active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* List / Grid Proyek */}
      {isLoading ? (
        <div className="py-16 text-center">
          <p className="font-inter text-sm text-textMain/70 animate-pulse">
            Memuat daftar proyek...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-3xl p-8 shadow-neu-in">
          <FolderGit2 size={36} className="mx-auto text-textMain/40 mb-3" />
          <h3 className="font-poppins font-bold text-base text-textMain mb-1">
            {searchQuery ? 'Tidak Ada Proyek yang Cocok' : 'Belum Ada Proyek'}
          </h3>
          <p className="font-inter text-xs text-textMain/70 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `Tidak ditemukan proyek dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : 'Tambahkan proyek portofolio pertama Anda untuk mulai menampilkannya.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2 rounded-full bg-accent text-white font-poppins font-bold text-xs shadow-neu-out hover:brightness-110 cursor-pointer"
            >
              Tambah Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <AdminProjectCard
              key={p.id}
              project={p}
              onEdit={handleOpenEditModal}
              onDelete={(proj) => setProjectToDelete(proj)}
              onTogglePublish={handleTogglePublish}
              isActionLoading={actionLoadingId === p.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AdminProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

      <AdminProjectDeleteModal
        isOpen={!!projectToDelete}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};
