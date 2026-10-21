"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZeeraMessage, INITIAL_MESSAGES } from "./zeera/types";
import { ZeeraHeader } from "./zeera/ZeeraHeader";
import { ZeeraMessageList } from "./zeera/ZeeraMessageList";
import { ZeeraInputBar } from "./zeera/ZeeraInputBar";
import { ZeeraMinimizedPill } from "./zeera/ZeeraMinimizedPill";

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
  const [messages, setMessages] = useState<ZeeraMessage[]>(INITIAL_MESSAGES);
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

  const handleTriggerAction = (action: NonNullable<ZeeraMessage["action"]>) => {
    setIsMinimized(true);
    setTimeout(() => {
      executeAction(action);
    }, 180);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ZeeraMessage = {
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

      const assistantMessage: ZeeraMessage = {
        id: `assistant-${++messageIdRef.current}`,
        role: "assistant",
        content: data.text,
        action: data.action,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.action) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              <ZeeraHeader
                url={url}
                isMaximized={isMaximized}
                onReset={() => setMessages(INITIAL_MESSAGES)}
                onMinimize={() => setIsMinimized(true)}
                onToggleMaximize={() => setIsMaximized(!isMaximized)}
                onClose={handleClose}
              />

              <ZeeraMessageList
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                onTriggerAction={handleTriggerAction}
              />

              <ZeeraInputBar
                input={input}
                isLoading={isLoading}
                inputRef={inputRef}
                onInputChange={setInput}
                onSubmit={handleSendMessage}
              />
            </motion.div>
          </div>

          {isMinimized && (
            <ZeeraMinimizedPill
              onRestore={() => setIsMinimized(false)}
              onClose={handleClose}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
