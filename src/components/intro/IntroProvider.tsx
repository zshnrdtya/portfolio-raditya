"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type IntroStatus = "checking" | "playing" | "transitioning" | "done" | "skipped";

interface IntroContextType {
  introStatus: IntroStatus;
  setIntroStatus: (status: IntroStatus) => void;
  skipIntro: () => void;
  completeIntro: () => void;
  replayIntro: () => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
}

const SESSION_KEY = "raditya_intro_seen_session";
const LEGACY_STORAGE_KEY = "raditya_intro_seen_v2";

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Initialize state immediately so there is zero delay or flicker
  const [introStatus, setIntroStatus] = useState<IntroStatus>(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.removeItem("raditya_intro_seen_v1");
      } catch {}

      // Always play in development
      if (process.env.NODE_ENV === "development") {
        return "playing";
      }

      // Check WebGL support
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          return "skipped";
        }
      } catch {
        return "skipped";
      }

      try {
        if (sessionStorage.getItem(SESSION_KEY) === "true") {
          return "done";
        }
      } catch {}
    }
    return "playing";
  });
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const skipIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
    }
    setIntroStatus("skipped");
  }, []);

  const completeIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
    }
    setIntroStatus("done");
  }, []);

  const replayIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setIntroStatus("playing");
  }, []);

  return (
    <IntroContext.Provider
      value={{
        introStatus,
        setIntroStatus,
        skipIntro,
        completeIntro,
        replayIntro,
        isAudioMuted,
        setIsAudioMuted,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return context;
}
