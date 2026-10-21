'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectItem } from '../types';
import { ProjectFormFields, FormState, FormHandlers } from './ProjectFormFields';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProjectItem>) => Promise<void>;
  projectToEdit: ProjectItem | null;
}

interface FormProps {
  projectToEdit: ProjectItem | null;
  onClose: () => void;
  onSave: (data: Partial<ProjectItem>) => Promise<void>;
}

const ProjectForm: React.FC<FormProps> = ({ projectToEdit, onClose, onSave }) => {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [image, setImage] = useState(projectToEdit?.image || '');
  const [techStack, setTechStack] = useState<string[]>(projectToEdit?.techStack || []);
  const [tagInput, setTagInput] = useState('');
  const [demoUrl, setDemoUrl] = useState(projectToEdit?.demoUrl || '');
  const [githubUrl, setGithubUrl] = useState(projectToEdit?.githubUrl || '');
  const [order, setOrder] = useState<number>(projectToEdit?.order ?? 0);
  const [published, setPublished] = useState<boolean>(projectToEdit?.published ?? true);

  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>(
    projectToEdit?.image?.startsWith('http') ? 'url' : 'upload'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiLanguage, setAiLanguage] = useState<'en' | 'id'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.fileName) {
        setImage(data.fileName);
      } else {
        setFormError(data.error || 'Gagal mengunggah foto proyek.');
      }
    } catch {
      setFormError('Terjadi kendala koneksi saat mengunggah foto.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      setFormError('Harap isi judul/nama proyek terlebih dahulu sebelum membuat deskripsi.');
      return;
    }

    setIsGeneratingAi(true);
    setFormError(null);

    try {
      const res = await fetch('/api/admin/projects/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, techStack, language: aiLanguage }),
      });
      const data = await res.json();
      if (res.ok && data.description) {
        setDescription(data.description);
      } else {
        setFormError(data.error || 'Gagal menghasilkan deskripsi AI.');
      }
    } catch {
      setFormError('Terjadi kendala koneksi ke server saat menghasilkan deskripsi.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setFormError('Nama/judul proyek wajib diisi.'); return; }
    if (!description.trim()) { setFormError('Deskripsi proyek wajib diisi.'); return; }
    if (!image.trim()) { setFormError('Foto atau URL gambar proyek wajib diisi.'); return; }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await onSave({
        id: projectToEdit?.id,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        techStack,
        demoUrl: demoUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        order: Number(order) || 0,
        published,
      });
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan data proyek.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImageSrc = image
    ? image.startsWith('http') || image.startsWith('/')
      ? image
      : `/foto-project/${image}`
    : null;

  const formState: FormState = {
    title, description, image, techStack, tagInput,
    demoUrl, githubUrl, order, published,
    imageInputMode, isUploading, isGeneratingAi,
    aiLanguage, isSubmitting, formError, fileInputRef,
  };

  const handlers: FormHandlers = {
    setTitle, setDescription, setImage, setTagInput,
    setImageInputMode, setDemoUrl, setGithubUrl,
    setOrder, setPublished, setAiLanguage,
    handleAddTag, handleRemoveTag, handleFileUpload,
    handleGenerateAiDescription, handleSubmit, onClose,
  };

  return (
    <ProjectFormFields
      formState={formState}
      handlers={handlers}
      previewImageSrc={previewImageSrc}
      projectToEdit={projectToEdit}
      onClose={onClose}
    />
  );
};

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  // Handle Escape key to close modal (DESIGN.md Directive)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textMain/40 backdrop-blur-xs overflow-y-auto"
    >
      <ProjectForm
        key={projectToEdit?.id || 'new'}
        projectToEdit={projectToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};
