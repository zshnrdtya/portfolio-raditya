'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

export interface CertificateData {
  title: string;
  issuer: string;
  image: string;
  credentialRole?: string;
  description?: string;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-surface rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-textMain/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-surface shadow-neu-out flex items-center justify-center text-accent shrink-0 border border-white/50">
              <ShieldCheck size={22} className="text-accent" />
            </div>
            <div>
              <h3
                id="cert-modal-title"
                className="font-poppins font-bold text-base sm:text-lg text-textMain tracking-tight leading-snug"
              >
                {certificate.title}
              </h3>
              <p className="font-inter text-xs text-textMain/75 mt-0.5">
                {certificate.issuer}
                {certificate.credentialRole ? ` • ${certificate.credentialRole}` : ''}
              </p>
            </div>
          </div>

          {/* Close button with >= 44px touch target */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau sertifikat"
            className="w-11 h-11 rounded-2xl bg-surface shadow-neu-out hover:shadow-neu-in active:shadow-neu-in flex items-center justify-center text-textMain/80 hover:text-textMain focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all cursor-pointer shrink-0 border border-white/40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Certificate Image */}
        <div className="my-4 overflow-y-auto max-h-[58vh] rounded-2xl bg-surface shadow-neu-in p-2 sm:p-3 flex items-center justify-center border border-textMain/10">
          <div className="relative w-full aspect-[3/4] max-w-md rounded-xl overflow-hidden shadow-sm">
            <Image
              src={certificate.image}
              alt={`Sertifikat ${certificate.title} dari ${certificate.issuer}`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 90vw, 480px"
              priority
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-textMain/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-inter text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Dokumen Resmi Terverifikasi</span>
          </div>

          <a
            href={certificate.image}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-accent text-white font-poppins font-bold text-xs sm:text-sm shadow-neu-out hover:brightness-110 active:brightness-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <ExternalLink size={15} />
            <span>Buka Gambar Penuh</span>
          </a>
        </div>
      </div>
    </div>
  );
};
