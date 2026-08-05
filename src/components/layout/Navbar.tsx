import Link from "next/link";

export default function Navbar() {
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Design", href: "#design" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto max-w-4xl w-11/12 z-50 bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] rounded-full px-8">
      <div className="flex items-center justify-center h-16 w-full">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between w-full px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-inter text-sm font-medium text-[var(--color-textMain)] hover:text-[var(--color-accent)] px-3 py-2 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-center w-full">
          <button className="text-[var(--color-textMain)] bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] p-2 rounded-full hover:text-[var(--color-accent)] focus:outline-none transition-all duration-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
