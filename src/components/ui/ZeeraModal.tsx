"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, Loader2, Minus, Maximize2, Minimize2 } from "lucide-react";

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
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sync state if isOpen prop changes from closed to open
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  }

  const handleClose = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
    onClose();
  }, [onClose]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    if (isMinimized) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMaximized) {
          setIsMaximized(false);
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMinimized, isMaximized, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (hidden when minimized) */}
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer z-[998]"
            />
          )}

          {/* Modal Container */}
          <div
            className={`fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 transition-all duration-200 ${
              isMinimized ? "pointer-events-none opacity-0 invisible" : "pointer-events-auto opacity-100 visible"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={
                !isMaximized
                  ? {
                      width: "375px",
                      maxWidth: "calc(100vw - 1.5rem)",
                      height: "700px",
                      maxHeight: "85vh",
                      borderRadius: "24px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    }
                  : undefined
              }
              className={`force-mobile-view relative z-10 bg-[var(--color-surface)] flex flex-col overflow-hidden border border-white/50 transition-all duration-300 ${
                isMaximized
                  ? "w-full max-w-5xl h-[88vh] max-h-[850px] rounded-3xl shadow-2xl"
                  : "w-[375px] max-w-[calc(100vw-1.5rem)] h-[700px] max-h-[85vh] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-black/5 bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] z-10 select-none">
                {/* Left: Branding & Status */}
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)] shrink-0">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="font-poppins font-bold text-sm sm:text-base text-[var(--color-textMain)] truncate">
                        Zeera AI
                      </h3>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                    {isMaximized && (
                      <p className="text-xs text-[var(--color-textMain)] opacity-70 truncate hidden sm:block">
                        Interactive AI Assistant by Raditya Rai Zeeshan
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Window Controls (Minimize, Maximize, External Link, Close) */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Minimize Button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize (Kecilkan ke sudut)"
                    className="p-1.5 sm:p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                    aria-label="Minimize"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Maximize / Restore Button */}
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Kembalikan ke Tampilan HP" : "Maksimalkan Tampilan"}
                    className="p-1.5 sm:p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                    aria-label={isMaximized ? "Restore Mobile View" : "Maximize View"}
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Open in New Tab */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka di tab baru"
                    className="p-1.5 sm:p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    title="Tutup"
                    className="p-1.5 sm:p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-red-600 active:shadow-[var(--shadow-neu-in)] transition-all cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / Iframe */}
              <div className="relative flex-1 w-full min-h-0 bg-white overflow-hidden">
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
                  className="w-full h-full border-none block"
                  style={{ width: "100%", height: "100%" }}
                  allow="clipboard-write; microphone; camera"
                />
              </div>
            </motion.div>
          </div>

          {/* Floating Pill when Minimized */}
          {isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setIsMinimized(false)}
              className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[var(--color-surface)] shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/60 cursor-pointer hover:scale-105 transition-all select-none group"
              title="Buka kembali Zeera AI"
              role="button"
              aria-label="Kembalikan Zeera AI"
            >
              <div className="p-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-poppins font-bold text-xs text-[var(--color-textMain)]">
                  Zeera AI
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                title="Tutup"
                className="p-1 rounded-full text-[var(--color-textMain)] hover:text-red-600 transition-colors ml-1 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
