"use client";

import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

// Menggunakan Static Import agar Next.js secara otomatis membaca resolusi & aspect ratio asli setiap foto (Portrait/Landscape)
import img1 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.30.38.jpeg';
import img3 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.30.41.jpeg';
import img4 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.30.53 (1).jpeg';
import img5 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.30.53.jpeg';
import img6 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.24 (1).jpeg';
import img7 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.24.jpeg';
import img8 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.25 (1).jpeg';
import img9 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.25 (2).jpeg';
import img10 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.25 (3).jpeg';
import img11 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.25.jpeg';
import img12 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.26 (1).jpeg';
import img13 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.26 (2).jpeg';
import img14 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.26 (3).jpeg';
import img15 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.26.jpeg';
import img16 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.27 (1).jpeg';
import img17 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.32.27.jpeg';
import img18 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.33.15.jpeg';
import img19 from '../../../public/gallery/WhatsApp Image 2026-08-07 at 10.33.16.jpeg';

const initialImages = [
  { id: 1, src: img1, title: 'Gallery Photo 1' },
  { id: 3, src: img3, title: 'Gallery Photo 3' },
  { id: 4, src: img4, title: 'Gallery Photo 4' },
  { id: 5, src: img5, title: 'Gallery Photo 5' },
  { id: 6, src: img6, title: 'Gallery Photo 6' },
  { id: 7, src: img7, title: 'Gallery Photo 7' },
  { id: 8, src: img8, title: 'Gallery Photo 8' },
  { id: 9, src: img9, title: 'Gallery Photo 9' },
  { id: 10, src: img10, title: 'Gallery Photo 10' },
  { id: 11, src: img11, title: 'Gallery Photo 11' },
  { id: 12, src: img12, title: 'Gallery Photo 12' },
  { id: 13, src: img13, title: 'Gallery Photo 13' },
  { id: 14, src: img14, title: 'Gallery Photo 14' },
  { id: 15, src: img15, title: 'Gallery Photo 15' },
  { id: 16, src: img16, title: 'Gallery Photo 16' },
  { id: 17, src: img17, title: 'Gallery Photo 17' },
  { id: 18, src: img18, title: 'Gallery Photo 18' },
  { id: 19, src: img19, title: 'Gallery Photo 19' },
];

// Duplicate the array so it can loop seamlessly
const marqueeImages = [...initialImages, ...initialImages];

const Gallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: StaticImageData; title: string } | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section id="gallery" className="py-20 bg-[var(--color-surface)] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center font-poppins text-slate-900" data-aos="fade-up">
          Gallery
        </h2>
      </div>
      
      {/* Marquee Container */}
      <div className="relative w-full flex group py-6">
        <div 
          className="flex shrink-0 items-center animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] w-max"
        >
          {marqueeImages.map((image, index) => (
            // Menggunakan padding pada item alih-alih gap pada parent untuk mencegah matematika marquee melompat di akhir loop
            <div key={index} className="px-3 md:px-4 shrink-0">
              <div 
                onClick={() => setSelectedPhoto(image)}
                className="group/frame p-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] transition-shadow duration-300 hover:shadow-[var(--shadow-neu-out)] cursor-pointer"
              >
                <div className="relative h-48 md:h-72 w-auto flex items-center justify-center">
                  <Image 
                    src={image.src} 
                    alt={image.title}
                    placeholder="blur" // Bonus: Efek blur otomatis saat loading karena kita menggunakan static import!
                    quality={65}
                    sizes="(max-width: 768px) 100vw, 350px"
                    priority={index < 6}
                    loading={index >= 6 ? "eager" : undefined}
                    className="h-full w-auto object-contain rounded-xl transition-transform duration-500 ease-in-out group-hover/frame:scale-105" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[85vh] h-[75vh] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            <Image 
              src={selectedPhoto.src} 
              alt={selectedPhoto.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
          
          <button 
            type="button"
            aria-label="Close photo preview"
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors z-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
