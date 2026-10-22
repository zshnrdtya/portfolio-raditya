'use client';

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { StatisticsContent } from '@/lib/siteContent';

interface StatisticsEditFormProps {
  initialData: StatisticsContent;
  onSave: (data: StatisticsContent) => Promise<void>;
  onClose: () => void;
}

export function StatisticsEditForm({ initialData, onSave, onClose }: StatisticsEditFormProps) {
  const [projectsCompleted, setProjectsCompleted] = useState<number>(initialData.projectsCompleted ?? 10);
  const [yearsLearning, setYearsLearning] = useState<number>(initialData.yearsLearning ?? 2);
  const [coreTechnologies, setCoreTechnologies] = useState<number>(initialData.coreTechnologies ?? 5);
  const [internshipExperience, setInternshipExperience] = useState<number>(initialData.internshipExperience ?? 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        projectsCompleted: Number(projectsCompleted) || 0,
        yearsLearning: Number(yearsLearning) || 0,
        coreTechnologies: Number(coreTechnologies) || 0,
        internshipExperience: Number(internshipExperience) || 0,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-900 text-xs font-semibold border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Projects Completed
          </label>
          <input
            type="number"
            min={0}
            value={projectsCompleted}
            onChange={(e) => setProjectsCompleted(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <div>
          <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Years of Learning
          </label>
          <input
            type="number"
            min={0}
            value={yearsLearning}
            onChange={(e) => setYearsLearning(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <div>
          <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Core Technologies
          </label>
          <input
            type="number"
            min={0}
            value={coreTechnologies}
            onChange={(e) => setCoreTechnologies(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <div>
          <label className="block font-poppins font-bold text-xs uppercase tracking-wider text-textMain mb-1.5">
            Internship Experience
          </label>
          <input
            type="number"
            min={0}
            value={internshipExperience}
            onChange={(e) => setInternshipExperience(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-2xl bg-surface shadow-neu-in text-textMain font-inter text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-textMain/10">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="min-h-[44px] px-5 py-2 rounded-full bg-surface shadow-neu-out hover:shadow-neu-in text-textMain font-bold text-xs transition-all cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] px-6 py-2 rounded-full bg-accent text-white font-poppins font-bold text-xs shadow-neu-out hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check size={14} />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
