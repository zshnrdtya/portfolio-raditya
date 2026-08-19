import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] mt-auto pt-8 pb-32 md:pb-8 shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] px-6 py-3 rounded-2xl">
          <p className="font-inter font-bold text-sm text-[var(--color-textMain)] opacity-80">
            &copy; 2026 Raditya Rai Zeeshan. All rights reserved.
          </p>
        </div>
        
        <div className="flex space-x-3 md:space-x-4">
          <Link 
            href="https://github.com/zshnrdtya" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-textMain)] bg-[var(--color-surface)] p-3 rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200"
          >
            <span className="sr-only">GitHub</span>
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link 
            href="https://www.instagram.com/zshnrdtya/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-textMain)] bg-[var(--color-surface)] p-3 rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200"
          >
            <span className="sr-only">Instagram</span>
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link 
            href="https://www.tiktok.com/@zshnrdtya" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-textMain)] bg-[var(--color-surface)] p-3 rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200"
          >
            <span className="sr-only">TikTok</span>
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.9 4.54-2.43 6.17-1.74 1.86-4.27 2.89-6.84 2.82-2.73-.07-5.32-1.35-7.05-3.41-1.68-2-2.33-4.66-1.85-7.18.42-2.18 1.62-4.14 3.32-5.49 1.74-1.38 3.96-2.07 6.19-1.89v4.13c-1.18-.11-2.42.06-3.45.69-1.04.64-1.77 1.67-2.05 2.85-.29 1.25-.09 2.62.61 3.66.75 1.13 2.05 1.83 3.4 1.96 1.43.14 2.9-.19 3.97-1.14 1.09-.96 1.66-2.41 1.66-3.89V0h3.5z" />
            </svg>
          </Link>
          <Link 
            href="https://www.linkedin.com/in/raditya-rai-zeeshan-05973641b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-textMain)] bg-[var(--color-surface)] p-3 rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200"
          >
            <span className="sr-only">LinkedIn</span>
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
          <Link 
            href="https://wa.me/6281946315326" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-textMain)] bg-[var(--color-surface)] p-3 rounded-full shadow-[var(--shadow-neu-out)] hover:text-[var(--color-accent)] active:shadow-[var(--shadow-neu-in)] transition-all duration-200"
          >
            <span className="sr-only">WhatsApp</span>
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
