'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import './IdentityDisplay.css';

interface CardProps {
  src: string;
  alt: string;
  lanyardColor: 'blue' | 'maroon' | 'amber';
  onAction?: () => void;
  actionLabel?: string;
}

const LanyardCard: React.FC<CardProps> = ({
  src,
  alt,
  lanyardColor,
  onAction,
  actionLabel,
}) => {
  const strapRef = useRef<HTMLDivElement>(null);
  const [baseHeight, setBaseHeight] = useState(128);

  const lanyardClass =
    lanyardColor === 'blue'
      ? 'lanyard-blue'
      : lanyardColor === 'maroon'
      ? 'lanyard-maroon'
      : 'lanyard-amber';

  const dragY = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      if (strapRef.current) {
        const h = strapRef.current.offsetHeight;
        if (h > 0) setBaseHeight(h);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const strapScaleY = useTransform(dragY, (y) => {
    const h = baseHeight > 0 ? baseHeight : 128;
    return Math.max(0.1, (h + y) / h);
  });

  return (
    <div className="lanyard-card-wrapper" data-aos="fade-up">
      <div className="lanyard-strap-positioner">
        <motion.div
          ref={strapRef}
          className={`lanyard-strap ${lanyardClass}`}
          style={{ scaleY: strapScaleY }}
        >
          <div className="lanyard-strap-inner" />
        </motion.div>
      </div>

      <motion.div
        className="id-card-3d"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.55 }}
        style={{ y: dragY }}
        whileDrag={{ scale: 1.02 }}
      >
        <div className="lanyard-clip-on-card">
          <div className="lanyard-clip">
            <div className="clip-body">
              <div className="clip-jaw clip-jaw-left" />
              <div className="clip-jaw clip-jaw-right" />
              <div className="clip-ring" />
            </div>
          </div>
        </div>

        <div className="card-hole-punch" />
        <div className="id-card-image-container">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={900}
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 240px"
            className="id-card-image"
            draggable={false}
            priority
          />
        </div>
      </motion.div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          aria-label={actionLabel}
          className="mt-3.5 min-h-[44px] px-3.5 py-2 rounded-2xl bg-surface shadow-neu-out hover:shadow-neu-in active:shadow-neu-in text-accent font-space-grotesk text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ShieldCheck size={16} className="text-accent" />
          <span>Lihat Sertifikat</span>
        </button>
      )}
    </div>
  );
};

interface IdentityDisplayProps {
  onOpenIndiCert?: () => void;
}

const IdentityDisplay: React.FC<IdentityDisplayProps> = ({ onOpenIndiCert }) => {
  return (
    <div className="identity-display-section" data-aos="fade-up">
      <div className="identity-heading">
        <span className="identity-heading-line" />
        <h3 className="identity-heading-text font-space-grotesk">
          PROFESSIONAL & COMMUNITY IDENTITY
        </h3>
        <span className="identity-heading-line" />
      </div>

      <div className="identity-cards-row">
        <LanyardCard
          src="/foto-raditya/raditya (1).png"
          alt="ID Card Inditech - Raditya Rai Zeeshan, Fullstack Web Developer Intern"
          lanyardColor="blue"
          onAction={onOpenIndiCert}
          actionLabel="Lihat Sertifikat Magang Indi Technology"
        />
        <LanyardCard
          src="/foto-raditya/raditya (2).png"
          alt="ID Card Karang Taruna 424 - Zeeshan, Koor Perlengkapan"
          lanyardColor="maroon"
        />
        <LanyardCard
          src="/foto-raditya/raditya(3).png"
          alt="ID Card Karang Taruna RT 04 - Rai, Koor Humas & PDD"
          lanyardColor="amber"
        />
      </div>
    </div>
  );
};

export default IdentityDisplay;
