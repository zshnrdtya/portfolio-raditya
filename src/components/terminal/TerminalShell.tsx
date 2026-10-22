'use client';

import React from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalHistory } from './TerminalHistory';
import { TerminalPrompt } from './TerminalPrompt';
import { QuickActionChips } from './QuickActionChips';
import { useTerminal } from './useTerminal';

export const TerminalShell: React.FC = () => {
  const {
    history,
    input,
    setInput,
    executeCommand,
    handleNavigateHistory,
    clearHistory,
    scrollRef,
  } = useTerminal();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[90vh] sm:h-[85vh] rounded-2xl bg-[#111827] border border-[#1e293b] shadow-2xl overflow-hidden">
      {/* 1. Header Bar Terminal */}
      <TerminalHeader onClear={clearHistory} />

      {/* 2. Scrollable Terminal Screen */}
      <div
        ref={scrollRef}
        onClick={() => {
          // Klik di mana saja dalam terminal otomatis fokus ke input prompt
          const inputEl = document.querySelector('input');
          inputEl?.focus();
        }}
        className="flex-1 p-4 sm:p-6 overflow-y-auto terminal-scrollbar space-y-4 cursor-text"
      >
        <TerminalHistory history={history} onRunCommand={executeCommand} />
        <TerminalPrompt
          input={input}
          setInput={setInput}
          onSubmit={handleFormSubmit}
          onNavigateHistory={handleNavigateHistory}
        />
      </div>

      {/* 3. Quick Action Chips Footer */}
      <div className="px-4 pb-3 bg-[#0f172a]/90">
        <QuickActionChips onRunCommand={executeCommand} />
      </div>
    </div>
  );
};
