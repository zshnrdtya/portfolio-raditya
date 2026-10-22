'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Code2, Loader2 } from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
}

const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: 'futsal-hub',
    title: 'FutsalHub Booking System',
    slug: 'futsal-hub',
    description: 'Aplikasi manajemen dan reservasi lapangan futsal berbasis web dengan sistem pembayaran digital dan kalender otomatis.',
    techStack: ['Laravel', 'MySQL', 'Tailwind CSS', 'Midtrans'],
    demoUrl: 'https://github.com/zshnrdtya',
    githubUrl: 'https://github.com/zshnrdtya',
  },
  {
    id: 'sambel-gondes',
    title: 'Sambel Gondes POS & Catalog',
    slug: 'sambel-gondes',
    description: 'Sistem Point of Sales (POS) dan katalog interaktif restoran kuliner dengan perhitungan transaksi dan cetak nota kasir.',
    techStack: ['React', 'Next.js', 'PostgreSQL', 'Prisma'],
    demoUrl: 'https://github.com/zshnrdtya',
    githubUrl: 'https://github.com/zshnrdtya',
  },
  {
    id: 'z-project',
    title: 'Z - Project Platform',
    slug: 'z-project',
    description: 'Portal layanan penyusunan tugas akademik, desain presentasi PowerPoint, dan pembuatan CV berstandar ATS.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    demoUrl: 'https://github.com/zshnrdtya',
    githubUrl: 'https://github.com/zshnrdtya',
  },
];

export const ProjectsOutput: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>(FALLBACK_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProjects(data);
          }
        }
      } catch {
        // Fallback sudah terisi
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-3 text-xs sm:text-sm">
      <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
        <span>Menampilkan {projects.length} karya unggulan:</span>
        {isLoading && <Loader2 size={14} className="animate-spin text-emerald-400" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="font-bold font-sans text-slate-100 text-sm sm:text-base">
                  {proj.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500">#{proj.slug}</span>
              </div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                {proj.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-sky-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 text-xs font-mono">
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline min-h-[36px] py-1"
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo</span>
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white hover:underline min-h-[36px] py-1"
                  >
                    <Code2 size={13} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
