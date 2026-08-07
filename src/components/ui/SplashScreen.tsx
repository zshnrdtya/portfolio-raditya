"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // The loading bar takes about 2 seconds, plus a tiny pause before exit
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // To prevent scrolling while splash screen is active
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-surface)]"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100vh" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Pulsing Center Logo (Squircle) */}
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] flex items-center justify-center text-[var(--color-textMain)] mb-6 shadow-[var(--shadow-neu-out)] bg-[var(--color-surface)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl md:text-5xl font-black tracking-widest font-poppins">
              RRZ
            </span>
          </motion.div>

          {/* Philosophical Tagline */}
          <motion.p
            className="text-xs md:text-sm text-slate-700 opacity-80 tracking-wide font-light text-center max-w-[280px] md:max-w-md mx-auto mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            "It's not the problem that is flawed; fix the mindset, and the problem solves itself."
          </motion.p>

          {/* Loading Bar */}
          <div className="w-48 md:w-56 h-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] overflow-hidden p-[2px]">
            <motion.div
              className="h-full bg-[var(--color-textMain)] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
