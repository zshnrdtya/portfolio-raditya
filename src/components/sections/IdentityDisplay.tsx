'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './IdentityDisplay.css';

interface CardProps {
  src: string;
  alt: string;
  lanyardColor: 'blue' | 'maroon' | 'amber';
}

const LanyardCard: React.FC<CardProps> = ({ src, alt, lanyardColor }) => {
  const lanyardClass =
    lanyardColor === 'blue'
      ? 'lanyard-blue'
      : lanyardColor === 'maroon'
      ? 'lanyard-maroon'
      : 'lanyard-amber';

  const dragY = useMotionValue(0);
  const strapScaleY = useTransform(dragY, [0, 120], [1, 1.9]);
  const clipY = useTransform(dragY, [0, 120], [0, 70]);

  return (
    <div className="lanyard-card-wrapper" data-aos="fade-up">
      <div className="lanyard-strap-positioner">
        <motion.div
          className={`lanyard-strap ${lanyardClass}`}
          style={{ scaleY: strapScaleY }}
        >
          <div className="lanyard-strap-inner" />
        </motion.div>
      </div>

      <div className="lanyard-clip-positioner">
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
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 240px"
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
      <div className="identity-heading">
        <span className="identity-heading-line" />
        <h3 className="identity-heading-text font-poppins">
          PROFESSIONAL & COMMUNITY IDENTITY
        </h3>
        <span className="identity-heading-line" />
      </div>

      <div className="identity-cards-row">
        <LanyardCard
          src="/foto-raditya/raditya (1).png"
          alt="ID Card Inditech - Raditya Rai Zeeshan, Fullstack Web Developer Intern"
          lanyardColor="blue"
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
