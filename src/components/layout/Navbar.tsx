"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Design", href: "#design" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
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
          // If the top of the section is at or above the middle of the viewport
          // we consider it active. Using 150px as top offset margin.
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break; // Stop at the first section matching this condition
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleNavClick = (href: string) => {
    const targetId = href.substring(1);
    setActiveSection(targetId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto max-w-4xl w-11/12 z-50">
      <div className={`bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] px-6 md:px-8 transition-all duration-300 ${isMobileMenuOpen ? 'rounded-3xl' : 'rounded-full'}`}>
        <div className="flex items-center justify-center h-16 w-full">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-between w-full px-2 relative">
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
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-end w-full">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--color-textMain)] bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] p-2 rounded-full hover:text-[var(--color-accent)] focus:outline-none transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 pb-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-inter text-base font-bold text-[var(--color-textMain)] hover:text-[var(--color-accent)] px-4 py-3 bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-xl text-center transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
