"use client";

import Image from "next/image";
import { useState } from "react";

export default function FeaturedProjects() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const projects = [
    {
      title: "Website Service Bengkel",
      image: "projek 1.png",
      description: "A web application for automotive repair services with efficient scheduling and customer management features.",
      techStack: ["Laravel", "Tailwind", "MySQL"],
    },
    {
      title: "3D Modelling Kapak",
      image: "projek 3.png",
      description: "Creation of a 3D axe model with detailed textures and realistic lighting for game asset purposes.",
      techStack: ["Blender"],
    },
    {
      title: "Website Berita",
      image: "projek 5.png",
      description: "A digital news portal with a dynamic, fast, and responsive Content Management System (CMS).",
      techStack: ["Laravel", "Tailwind CSS", "Alpine.js", "MySQL"],
    },
    {
      title: "Website Pancong",
      image: "projek 6.png",
      description: "An interactive e-commerce catalog for selling kue pancong with an appetizing user interface.",
      techStack: ["Laravel", "CSS Native", "MySQL"],
    },
    {
      title: "Clone Website Kredivo",
      image: "projek 8.webp",
      description: "A responsive UI clone of the Kredivo website, focusing on interface design accuracy.",
      techStack: ["NextJS"],
    },
    {
      title: "Website Teh Pucuk ",
      image: "projek 9.webp",
      description: "An interactive landing page for Teh Pucuk product promotion with fresh and engaging animations.",
      techStack: ["NextJS"],
    },
    {
      title: "Website Booking Futsal",
      image: "projek 10.webp",
      description: "An integrated futsal field booking platform with real-time schedule availability.",
      techStack: ["Laravel", "Alpine.js", "MySQL", "Tailwind CSS"],
    }
  ];

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <section id="projects" className="py-24 relative bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left" data-aos="fade-up">
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-slate-900 inline-block relative pb-2 drop-shadow-sm">
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-[var(--color-surface)] rounded-3xl overflow-hidden 
                         shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)]
                         transition-shadow duration-300 group flex flex-col h-full cursor-pointer p-6"
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)] p-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image 
                    src={`/foto-project/${project.image}`}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  />
                </div>
              </div>

              <div className="pt-6 flex-grow flex flex-col">
                <h3 className="font-poppins font-black text-2xl text-[var(--color-textMain)] mb-3">
                  {project.title}
                </h3>
                <p className="font-inter text-base font-medium text-[var(--color-textMain)] leading-relaxed mb-6 flex-grow opacity-80">
                  {project.description}
                </p>
                
                <div className="pt-4 flex flex-wrap gap-3 mt-auto">
                  {project.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 text-xs md:text-sm font-bold bg-[var(--color-surface)] text-[var(--color-accent)] 
                                 rounded-full shadow-[var(--shadow-neu-out)] whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
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
    </section>
  );
}
