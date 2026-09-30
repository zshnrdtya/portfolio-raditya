'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './IdentityDisplay.css';

interface CardProps {
  src: string;
  alt: string;
  lanyardColor: 'blue' | 'maroon' | 'amber';
}

const LanyardCard: React.FC<CardProps> = ({ src, alt, lanyardColor }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [strapBaseHeight, setStrapBaseHeight] = useState(125);

  const lanyardClass =
    lanyardColor === 'blue'
      ? 'lanyard-blue'
      : lanyardColor === 'maroon'
      ? 'lanyard-maroon'
      : 'lanyard-amber';

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    const updateStrapMetrics = () => {
      if (cardRef.current) {
        const cardTop = cardRef.current.offsetTop;
        const ringY = Math.max(60, cardTop - 16);
        setStrapBaseHeight(ringY);
      }
    };

    updateStrapMetrics();
    window.addEventListener('resize', updateStrapMetrics);
    return () => window.removeEventListener('resize', updateStrapMetrics);
  }, []);

  const strapScaleY = useTransform([dragX, dragY], ([x, y]) => {
    const dx = typeof x === 'number' ? x : 0;
    const dy = typeof y === 'number' ? y : 0;
    const distance = Math.hypot(dx, strapBaseHeight + dy);
    return Math.max(0.1, distance / strapBaseHeight);
  });

  const strapRotate = useTransform([dragX, dragY], ([x, y]) => {
    const dx = typeof x === 'number' ? x : 0;
    const dy = typeof y === 'number' ? y : 0;
    return Math.atan2(dx, strapBaseHeight + dy) * (180 / Math.PI);
  });

  const cardRotate = useTransform(dragX, [-80, 80], [-7, 7]);

  return (
    <div className="lanyard-card-wrapper" data-aos="fade-up">
      <div className="lanyard-strap-positioner">
        <motion.div
          className={`lanyard-strap ${lanyardClass}`}
          style={{
            height: strapBaseHeight,
            scaleY: strapScaleY,
            rotate: strapRotate,
          }}
        >
          <div className="lanyard-strap-inner" />
        </motion.div>
      </div>

      <motion.div
        ref={cardRef}
        className="id-card-3d"
        drag={true}
        dragConstraints={{ top: 0, left: -70, right: 70, bottom: 240 }}
        dragElastic={0.25}
        style={{ x: dragX, y: dragY, rotate: cardRotate }}
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
