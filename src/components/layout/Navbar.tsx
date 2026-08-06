"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { 
      name: "Home", 
      href: "#home",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: "Skills", 
      href: "#skills",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: "Projects", 
      href: "#projects",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: "Design", 
      href: "#design",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    { 
      name: "About", 
      href: "#about",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: "Contact", 
      href: "#contact",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      let currentSection = activeSection;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleNavClick = (href: string) => {
    const targetId = href.substring(1);
    setActiveSection(targetId);
  };

  return (
    <>
      {/* Desktop Nav (Top) */}
      <nav className="hidden md:block fixed top-4 left-0 right-0 mx-auto max-w-4xl w-11/12 z-50">
        <div className="bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] px-8 rounded-full">
          <div className="flex items-center justify-between h-16 w-full relative">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative font-inter text-sm font-bold px-5 py-2 transition-colors duration-300 z-10 ${
                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-textMain)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill-desktop"
                      className="absolute inset-0 bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Nav Dock (Bottom) */}
      <nav className="md:hidden fixed bottom-6 left-0 right-0 mx-auto w-11/12 max-w-[400px] z-50">
        <div className="bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] px-4 py-3 rounded-full flex justify-between items-center relative">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 transition-colors duration-300 z-10 ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-textMain)] hover:text-[var(--color-accent)] opacity-70 hover:opacity-100"
                }`}
                title={link.name}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill-mobile"
                    className="absolute inset-0 bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-center">
                  {link.icon}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
