"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import AOS from "aos";
import { ExternalLink } from "lucide-react";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

interface ProjectItem {
  id?: string;
  title: string;
  slug?: string;
  image: string;
  description: string;
  techStack: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
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
    title: "Website Teh Pucuk",
    image: "projek 9.webp",
    description: "An interactive landing page for Teh Pucuk product promotion with fresh and engaging animations.",
    techStack: ["NextJS"],
  },
  {
    title: "Website Booking Futsal",
    image: "projek 10.webp",
    description: "An integrated futsal field booking platform with real-time schedule availability.",
    techStack: ["Laravel", "Alpine.js", "MySQL", "Tailwind CSS"],
  },
  {
    title: "Zeera AI",
    image: "project zeera.webp",
    description: "A conversational AI interface featuring real-time messaging, model responses, and a clean mobile-friendly layout.",
    techStack: ["Vite", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://zeeraai.radityarz.my.id/",
  }
];

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
          }
        }
      } catch {
        // Fallback to DEFAULT_PROJECTS if database or network is unavailable
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const scrollToProjects = () => {
    const section = document.getElementById("projects");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToProjects();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToProjects();
    }
  };

  useEffect(() => {
    AOS.refresh();
  }, [currentPage, projects]);

  return (
    <section id="projects" className="py-24 relative bg-[var(--color-surface)] scroll-mt-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left" data-aos="fade-up">
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-slate-900 inline-block relative pb-2 drop-shadow-sm">
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[450px]">
          {visibleProjects.map((project, index) => {
            const imageSrc =
              project.image.startsWith("http") || project.image.startsWith("/")
                ? project.image
                : `/foto-project/${project.image}`;

            return (
              <div
                key={project.id || project.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-[var(--color-surface)] rounded-3xl overflow-hidden 
                           shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)]
                           transition-shadow duration-300 group flex flex-col h-full p-6"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)] p-2">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-textMain/5">
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    />
                  </div>
                </div>

                <div className="pt-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-poppins font-black text-2xl text-[var(--color-textMain)]">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Lihat Live Demo"
                          aria-label={`Buka demo ${project.title}`}
                          className="w-8 h-8 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] flex items-center justify-center text-[var(--color-textMain)] hover:text-[var(--color-accent)] transition-all cursor-pointer"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Lihat Repository GitHub"
                          aria-label={`Buka repository GitHub ${project.title}`}
                          className="w-8 h-8 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] flex items-center justify-center text-[var(--color-textMain)] hover:text-[var(--color-accent)] transition-all cursor-pointer"
                        >
                          <GithubIcon size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="font-inter text-base font-medium text-[var(--color-textMain)] leading-relaxed mb-6 flex-grow opacity-80">
                    {project.description}
                  </p>

                  <div className="pt-4 flex flex-wrap gap-2.5 mt-auto">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 text-xs md:text-sm font-bold bg-[var(--color-surface)] text-[var(--color-accent)] 
                                   rounded-xl shadow-[var(--shadow-neu-out)] whitespace-nowrap"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center space-x-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`w-12 h-12 flex items-center justify-center font-poppins font-black text-xl rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
                ${
                  currentPage === 1
                    ? "bg-[var(--color-surface)] text-gray-400 shadow-[var(--shadow-neu-in)] cursor-not-allowed opacity-50"
                    : "bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] hover:text-[var(--color-accent)] cursor-pointer"
                }`}
              aria-label="Previous Page"
            >
              &lt;
            </button>

            <span className="font-inter font-black text-xl text-[var(--color-accent)] px-6 py-3 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)]">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`w-12 h-12 flex items-center justify-center font-poppins font-black text-xl rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
                ${
                  currentPage === totalPages
                    ? "bg-[var(--color-surface)] text-gray-400 shadow-[var(--shadow-neu-in)] cursor-not-allowed opacity-50"
                    : "bg-[var(--color-surface)] text-[var(--color-textMain)] shadow-[var(--shadow-neu-out)] active:shadow-[var(--shadow-neu-in)] hover:text-[var(--color-accent)] cursor-pointer"
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
