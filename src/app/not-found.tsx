import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="bg-surface shadow-neu-out p-8 md:p-16 rounded-[40px] max-w-2xl w-full flex flex-col items-center gap-6 animate-fade-in-up">
        
        {/* Giant 404 */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-black text-accent font-poppins drop-shadow-lg">
            404
          </h1>
          <div className="absolute inset-0 bg-surface/10 rounded-full blur-2xl -z-10" />
        </div>
        
        {/* Texts */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-textMain font-poppins leading-snug">
            HAYO NYARI APA LUU?? WKWKWK 🤨📸
          </h2>
          <p className="text-base md:text-lg text-textMain/70 font-medium max-w-md mx-auto">
            Halaman yang lu cari ga ada, mending balik aja dah.
          </p>
        </div>

        {/* Button */}
        <Link 
          href="/"
          className="mt-6 flex items-center gap-2 px-8 py-4 bg-surface text-textMain font-semibold rounded-full shadow-neu-out hover:shadow-neu-in hover:text-accent transition-all duration-300 transform hover:scale-[0.98]"
        >
          <Home size={18} />
          <span>Balik ke jalan yang benar</span>
        </Link>
      </div>
    </div>
  );
}
