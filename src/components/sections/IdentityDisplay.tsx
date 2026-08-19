'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './IdentityDisplay.css';

interface CardProps {
  src: string;
  alt: string;
  lanyardColor: 'blue' | 'maroon';
}

const LanyardCard: React.FC<CardProps> = ({ src, alt, lanyardColor }) => {
  const lanyardClass = lanyardColor === 'blue' ? 'lanyard-blue' : 'lanyard-maroon';

  // Track the card's vertical drag displacement
  const dragY = useMotionValue(0);

  // Map drag Y → lanyard scaleY (stretch effect)
  const strapScaleY = useTransform(dragY, [0, 120], [1, 1.9]);

  // Map drag Y → clip vertical offset (follows the card down)
  const clipY = useTransform(dragY, [0, 120], [0, 70]);

  return (
    <div className="lanyard-card-wrapper" data-aos="fade-up">
      {/* Positioning wrapper for strap — handles centering via CSS */}
      <div className="lanyard-strap-positioner">
        {/* Animated strap — only scaleY, no translateX conflict */}
        <motion.div
          className={`lanyard-strap ${lanyardClass}`}
          style={{ scaleY: strapScaleY }}
        >
          <div className="lanyard-strap-inner" />
        </motion.div>
      </div>

      {/* Positioning wrapper for clip — handles centering via CSS */}
      <div className="lanyard-clip-positioner">
        {/* Animated clip — only y offset */}
        <motion.div
          className="lanyard-clip"
          style={{ y: clipY }}
        >
          <div className="clip-body">
            <div className="clip-jaw clip-jaw-left" />
            <div className="clip-jaw clip-jaw-right" />
            <div className="clip-ring" />
          </div>
        </motion.div>
      </div>

      {/* Draggable ID card */}
      <motion.div
        className="id-card-3d"
        drag={true}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0.4}
        style={{ y: dragY }}
        whileDrag={{ scale: 1.03 }}
      >
        <div className="card-hole-punch" />
        <div className="id-card-image-container">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={900}
            sizes="(max-width: 768px) 45vw, 280px"
            className="id-card-image"
            draggable={false}
            priority
          />
        </div>
      </motion.div>
    </div>
  );
};

const IdentityDisplay: React.FC = () => {
  return (
    <div className="identity-display-section" data-aos="fade-up">
      {/* Section subtitle */}
      <div className="identity-heading">
        <span className="identity-heading-line" />
        <h3 className="identity-heading-text font-poppins">
          PROFESSIONAL & COMMUNITY IDENTITY
        </h3>
        <span className="identity-heading-line" />
      </div>

      {/* Two cards side by side */}
      <div className="identity-cards-row">
        <LanyardCard
          src="/foto-raditya/raditya (1).png"
          alt="ID Card Inditech — Raditya Rai Zeeshan, Fullstack Web Developer Intern"
          lanyardColor="blue"
        />
        <LanyardCard
          src="/foto-raditya/raditya (2).png"
          alt="ID Card Karang Taruna 424 — Zeeshan, Koor Perlengkapan"
          lanyardColor="maroon"
        />
      </div>
    </div>
  );
};

export default IdentityDisplay;
