"use client";

import Image from "next/image";
import { useState } from "react";

export default function DesignCorner() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 6;

  const designs = [
    { title: "Batik Nasional", image: "Cerita Instagram Selamat Hari Batik Nasional Ilustrasi Cokelat dan Putih.png", tools: "Canva" },
    { title: "Design Baju", image: "DGBK1.png", tools: "Canva" },
    { title: "Flyer AYP JDCI", image: "FLYER AYP JDCI.png", tools: "Canva" },
    { title: "Hari Pemuda", image: "Merah Putih Ilustrasi Selamat Hari Pemuda Konten Instagram.png", tools: "Canva" },
    { title: "Kesaktian Pancasila", image: "Merah Putih Sederhana Hari Kesaktian Pancasila Cerita Instagram.png", tools: "Canva" },
    { title: "Raditya X PPLG", image: "Raditya Rai Zeeshan X PPLG 1.png", tools: "Canva" },
    { title: "Stiker Ekata", image: "Stiker Ekata Famiglia.png", tools: "Canva" },
  ];

  const totalPages = Math.ceil(designs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleDesigns = designs.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section id="design" className="py-24 relative bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-[var(--color-textMain)] inline-block relative pb-2 drop-shadow-sm">
            Design Corner
          </h2>
          <p className="font-inter font-medium text-[var(--color-textMain)] mt-6 max-w-2xl mx-auto opacity-80">
            A glimpse into my creative side, featuring graphic design, logo edits, and vector art.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleDesigns.map((design, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setSelectedImage(design.image)}
              className="group relative aspect-square rounded-3xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] transition-shadow duration-300 p-4 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="absolute inset-4 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] overflow-hidden group-hover:scale-[0.98] transition-transform duration-300">
                <Image 
                  src={`/foto-designer/${design.image}`}
                  alt={design.title}
                  fill
                  className="object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay gradient and text */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="font-poppins font-bold text-lg text-[var(--color-textMain)] translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {design.title}
                  </span>
                  <span className="font-inter font-medium text-sm text-[var(--color-accent)] translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    Made with {design.tools}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center space-x-6">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`w-12 h-12 flex items-center justify-center font-poppins font-black text-xl rounded-full transition-all duration-200 focus:outline-none
                ${currentPage === 1 
                  ? 'bg-[var(--color-surface)] text-gray-400 shadow-[var(--shadow-neu-in)] cursor-not-allowed opacity-50' 
                  : 'bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] hover:text-[var(--color-accent)]'
                }`}
              aria-label="Previous Page"
            >
              &lt;
            </button>
            
            <span className="font-inter font-black text-xl text-[var(--color-accent)] px-6 py-3 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)]">
              {currentPage} / {totalPages}
            </span>

            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`w-12 h-12 flex items-center justify-center font-poppins font-black text-xl rounded-full transition-all duration-200 focus:outline-none
                ${currentPage === totalPages 
                  ? 'bg-[var(--color-surface)] text-gray-400 shadow-[var(--shadow-neu-in)] cursor-not-allowed opacity-50' 
                  : 'bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] hover:text-[var(--color-accent)]'
                }`}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src={`/foto-designer/${selectedImage}`}
              alt="Full Design View"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] hover:text-red-500 transition-colors z-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
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
}
