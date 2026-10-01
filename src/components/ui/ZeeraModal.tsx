"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  MessageSquare,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Bot,
  RotateCcw,
} from "lucide-react";

interface ZeeraModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: {
    type: "navigate" | "fill_contact";
    payload: {
      section?: string;
      pesan?: string;
    };
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Halo! Aku Zeera AI, copilot cerdas portofolio Raditya Rai Zeeshan. Mau tahu tentang proyek unggulan, keahlian teknis, atau butuh bantuan navigasi ke bagian tertentu? Tanyakan saja langsung!",
  },
];

const QUICK_PROMPTS = [
  { label: "🚀 Proyek Unggulan", text: "Tolong tunjukkan proyek-proyek unggulan buatan Raditya." },
  { label: "⚡ Keahlian & Stack", text: "Apa saja keahlian dan tech stack utama yang dikuasai Raditya?" },
  { label: "💼 Pengalaman", text: "Ceritakan tentang pengalaman kerja dan organisasi Raditya." },
  { label: "✉️ Hubungi Raditya", text: "Aku ingin menghubungi Raditya untuk tawaran kerja sama." },
];

export default function ZeeraModal({
  isOpen,
  onClose,
  url = "https://zeeraai.radityarz.my.id/",
}: ZeeraModalProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageIdRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Execute portfolio interactive actions (smooth scroll, fill contact draft)
  const executeAction = useCallback((action: { type: string; payload: Record<string, unknown> }) => {
    if (action.type === "navigate" && typeof action.payload?.section === "string") {
      const targetId = action.payload.section.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (action.type === "fill_contact") {
      const contactElem = document.getElementById("contact");
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (typeof action.payload?.pesan === "string") {
        const textarea = document.getElementById("contact-pesan") as HTMLTextAreaElement | null;
        if (textarea) {
          textarea.value = action.payload.pesan;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
    onClose();
  }, [onClose]);

  // Handle escape key and body scroll lock (only lock on desktop when not minimized)
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

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `user-${++messageIdRef.current}`,
      role: "user",
      content: messageText,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/zeera/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.error || "Gagal mengambil respon dari Zeera AI.");
      }

      const assistantMessage: Message = {
        id: `assistant-${++messageIdRef.current}`,
        role: "assistant",
        content: data.text,
        action: data.action,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.action) {
        // Otomatis perkecil popup chat ke floating pill agar pengguna dapat menikmati animasi smooth scroll mandiri
        setTimeout(() => {
          setIsMinimized(true);
          setTimeout(() => {
            executeAction(data.action!);
          }, 180);
        }, 750);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Maaf, terjadi gangguan saat menghubungkan ke server. Silakan coba lagi sebentar ya!";

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${++messageIdRef.current}`,
          role: "assistant",
          content: errorMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

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
              isMinimized
                ? "pointer-events-none opacity-0 invisible"
                : "pointer-events-auto opacity-100 visible"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`relative z-10 bg-[var(--color-surface)] flex flex-col overflow-hidden border border-white/50 transition-all duration-300 ${
                isMaximized
                  ? "w-full max-w-4xl h-[90vh] max-h-[860px] rounded-3xl shadow-2xl"
                  : "w-[400px] max-w-[calc(100vw-1.5rem)] h-[700px] max-h-[88vh] rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] z-10 select-none">
                {/* Branding & Status */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)] shrink-0">
                    <Bot className="w-4 h-4 text-[#136846]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-poppins font-bold text-sm sm:text-base text-[var(--color-textMain)] truncate">
                        Zeera AI
                      </h3>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Copilot
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-textMain)] opacity-70 truncate">
                      Asisten Cerdas Portofolio Raditya
                    </p>
                  </div>
                </div>

                {/* Window Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Reset Chat Button */}
                  <button
                    onClick={handleResetChat}
                    title="Ulang percakapan"
                    className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
                    aria-label="Reset Chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Minimize Button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Kecilkan ke sudut"
                    className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
                    aria-label="Minimize"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Maximize / Restore Button */}
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Kembalikan ukuran" : "Maksimalkan tampilan"}
                    className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
                    aria-label={isMaximized ? "Restore View" : "Maximize View"}
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Standalone Web Link */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka website Zeera AI asli di tab baru"
                    className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Open standalone Zeera website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    title="Tutup"
                    className="p-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-textMain)] hover:text-red-600 active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm font-inter leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#136846] text-white shadow-md rounded-tr-sm"
                          : "bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] border border-white/50 rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Interactive Action Pill if triggered */}
                    {msg.action && (
                      <button
                        onClick={() => {
                          setIsMinimized(true);
                          setTimeout(() => {
                            executeAction(msg.action!);
                          }, 180);
                        }}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] border border-white/40 text-[11px] font-poppins font-semibold text-[#136846] active:scale-95 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#136846]" />
                        <span>
                          {msg.action.type === "navigate"
                            ? `📍 Menuju ke bagian #${msg.action.payload.section}`
                            : "✉️ Draf pesan kontak disiapkan"}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-[#136846]" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] border border-white/40 w-fit">
                    <Loader2 className="w-4 h-4 animate-spin text-[#136846]" />
                    <span className="text-xs font-inter text-[var(--color-textMain)] opacity-80">
                      Zeera AI sedang berpikir...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 border-t border-black/5 bg-[var(--color-surface)]/80 overflow-x-auto no-scrollbar flex items-center gap-2">
                {QUICK_PROMPTS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.text)}
                    disabled={isLoading}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] active:scale-95 text-[11px] font-poppins font-medium text-[var(--color-textMain)] border border-white/40 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 sm:p-4 border-t border-black/5 bg-[var(--color-surface)] flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya Zeera AI tentang portofolio..."
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] border border-white/40 text-xs sm:text-sm font-inter text-[var(--color-textMain)] placeholder:text-[var(--color-textMain)]/50 focus:outline-none focus:ring-2 focus:ring-[#136846]/40 disabled:opacity-60 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] active:scale-95 flex items-center justify-center text-[#136846] border border-white/40 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                  aria-label="Kirim Pesan"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
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
              className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[var(--color-surface)] shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/60 cursor-pointer hover:scale-105 transition-all select-none group"
              title="Buka kembali Zeera AI"
              role="button"
              aria-label="Kembalikan Zeera AI"
            >
              <div className="p-1.5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] text-[var(--color-accent)]">
                <MessageSquare className="w-4 h-4 text-[#136846] animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-poppins font-bold text-xs text-[var(--color-textMain)]">
                  Zeera AI
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Copilot
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
