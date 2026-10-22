'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalHistoryItem, TerminalCommandType } from './types';

export function useTerminal() {
  const [history, setHistory] = useState<TerminalHistoryItem[]>(() => [
    {
      id: 'initial-welcome',
      command: '',
      type: 'WELCOME',
      timestamp: 0,
    },
  ]);

  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const parseCommand = (raw: string): { type: TerminalCommandType; rawArgs?: string } => {
    const trimmed = raw.trim();
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
      case 'menu':
        return { type: 'HELP' };
      case 'about':
      case 'bio':
      case 'whoami':
        return { type: 'ABOUT' };
      case 'projects':
      case 'project':
      case 'porto':
      case 'portfolio':
        return { type: 'PROJECTS' };
      case 'skills':
      case 'skill':
      case 'stack':
      case 'tech':
        return { type: 'SKILLS' };
      case 'experience':
      case 'exp':
      case 'work':
        return { type: 'EXPERIENCE' };
      case 'awards':
      case 'award':
      case 'achievements':
      case 'achievement':
        return { type: 'AWARDS' };
      case 'contact':
      case 'email':
      case 'sosmed':
      case 'socials':
        return { type: 'CONTACT' };
      case 'guestbook':
      case 'pesan':
      case 'buku-tamu':
        return { type: 'GUESTBOOK' };
      case 'stats':
      case 'radar':
      case 'telemetry':
        return { type: 'STATS' };
      case 'ai':
      case 'zeera':
      case 'gemini':
      case 'ask':
        return { type: 'AI', rawArgs: args };
      case 'login':
      case 'admin':
      case 'sudo':
      case 'dashraditya':
        return { type: 'LOGIN' };
      case 'welcome':
        return { type: 'WELCOME' };
      default:
        return { type: 'UNKNOWN' };
    }
  };

  const executeCommand = useCallback((rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear' || trimmed.toLowerCase() === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    // Catat ke riwayat input keyboard
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const { type, rawArgs } = parseCommand(trimmed);

    const newEntry: TerminalHistoryItem = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      command: trimmed,
      type,
      rawArgs,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, newEntry]);
    setInput('');
  }, []);

  const handleNavigateHistory = useCallback(
    (direction: 'up' | 'down') => {
      if (commandHistory.length === 0) return;

      if (direction === 'up') {
        const nextIdx =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else {
        if (historyIndex === -1) return;
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(commandHistory[nextIdx]);
        }
      }
    },
    [commandHistory, historyIndex]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setInput('');
  }, []);

  return {
    history,
    input,
    setInput,
    executeCommand,
    handleNavigateHistory,
    clearHistory,
    scrollRef,
  };
}
