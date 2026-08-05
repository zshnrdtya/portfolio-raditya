"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const roles = [
    "FrontEnd Developer",
    "Ui/Ux Designer",
    "BackEnd Enthusiast",
    "Web Enthusiast",
    "Fullstack Developer"
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        // Pause at the end before deleting
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        const nextText = isDeleting 
          ? currentRole.substring(0, displayText.length - 1)
          : currentRole.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, currentRoleIndex, isDeleting, roles]);

  return (
    <section id="home" className="min-h-[75vh] flex flex-col md:flex-row items-center justify-center relative overflow-hidden pt-32 pb-8 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="font-poppins font-black text-5xl md:text-6xl lg:text-7xl tracking-tight text-[var(--color-textMain)] mb-6 leading-tight drop-shadow-sm">
            Hi, I am <br className="hidden md:block lg:hidden" />
            Raditya Rai Zeeshan
          </h1>
          
          <div className="font-inter text-xl md:text-3xl text-[var(--color-textMain)] font-bold mb-10 flex flex-wrap justify-center md:justify-start items-center h-12">
            <span className="mr-3">I am a</span>
            <span 
              className="inline-block px-4 py-2 bg-[var(--color-surface)] rounded-xl shadow-[var(--shadow-neu-in)] text-[var(--color-accent)] min-w-[240px] sm:min-w-[280px] text-left"
            >
              {displayText}
              <span className="animate-pulse border-r-2 border-[var(--color-accent)] ml-1 h-full inline-block">&nbsp;</span>
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
            <Link href="#contact">
              <button className="w-full sm:w-auto px-8 py-3 font-poppins font-bold text-lg bg-[var(--color-surface)] text-[var(--color-accent)] rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-textMain)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200 focus:outline-none">
                Hire Me
              </button>
            </Link>
            <a href="/cv/CV - Raditya Rai Zeeshan.pdf" target="_blank" rel="noopener noreferrer">
              <button className="w-full sm:w-auto px-8 py-3 font-poppins font-bold text-lg bg-[var(--color-surface)] text-[var(--color-textMain)] rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200 focus:outline-none">
                Download CV
              </button>
            </a>
          </div>
        </div>

        {/* Profile Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-[var(--color-surface)] p-3 shadow-[var(--shadow-neu-out)]">
            <div className="relative w-full h-full overflow-hidden rounded-full shadow-[var(--shadow-neu-in)] p-1">
              <Image 
                src="/foto-raditya/logo zz.png" 
                alt="Raditya Rai Zeeshan Logo" 
                fill
                className="object-contain object-center rounded-full scale-90"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
