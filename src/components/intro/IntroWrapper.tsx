"use client";

import dynamic from "next/dynamic";
import { useIntro } from "./IntroProvider";

const IntroScene = dynamic(() => import("./IntroScene"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen bg-[#C6E0D2] flex flex-col items-center justify-center select-none"
      style={{ touchAction: "none" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#C6E0D2] shadow-[8px_8px_16px_rgba(150,175,161,0.8),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#136846] border-t-transparent animate-spin" />
        </div>
        <p className="font-poppins font-bold text-sm text-[#284435] tracking-wide">
          Memuat Dunia 3D...
        </p>
      </div>
    </div>
  ),
});

export default function IntroWrapper() {
  const { introStatus } = useIntro();

  // If already finished or skipped, completely unmount
  if (introStatus === "done" || introStatus === "skipped") {
    return null;
  }

  return <IntroScene />;
}
