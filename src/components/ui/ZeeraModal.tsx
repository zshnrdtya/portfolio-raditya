"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, Loader2 } from "lucide-react";

interface ZeeraModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export default function ZeeraModal({
  isOpen,
  onClose,
  url = "https://zeeraai.radityarz.my.id/",
}: ZeeraModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Close modal on Escape key press and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-[var(--color-surface)] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/40 z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-poppins font-black text-lg md:text-xl text-[var(--color-textMain)]">
                      Zeera AI
                    </h3>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-textMain)] opacity-70 hidden sm:block">
                    Interactive AI Assistant by Raditya Rai Zeeshan
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka di tab baru"
                  className="p-2.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <button
                  onClick={onClose}
                  title="Tutup"
                  className="p-2.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-red-600 active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Iframe */}
            <div className="relative flex-1 w-full h-full bg-white overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface)] gap-3 z-0">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
                  <p className="font-inter text-sm font-semibold text-[var(--color-textMain)]">
                    Memuat Zeera AI...
                  </p>
                </div>
              )}
              <iframe
                src={url}
                title="Zeera AI"
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-none"
                allow="clipboard-write; microphone; camera"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
