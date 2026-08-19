'use client';

import React from 'react';
import Image from 'next/image';
import './IdentityDisplay.css';

interface CardProps {
  src: string;
  alt: string;
  lanyardColor: 'blue' | 'maroon';
}

const LanyardCard: React.FC<CardProps> = ({ src, alt, lanyardColor }) => {
  const lanyardClass = lanyardColor === 'blue' ? 'lanyard-blue' : 'lanyard-maroon';

  return (
    <div className="lanyard-card-wrapper" data-aos="fade-up">
      {/* Lanyard strap going upward */}
      <div className={`lanyard-strap ${lanyardClass}`}>
        <div className="lanyard-strap-inner" />
      </div>

      {/* Metal clip at junction */}
      <div className="lanyard-clip">
        <div className="clip-body">
          <div className="clip-jaw clip-jaw-left" />
          <div className="clip-jaw clip-jaw-right" />
          <div className="clip-ring" />
        </div>
      </div>

      {/* ID card with hole punch */}
      <div className="id-card-3d">
        <div className="card-hole-punch" />
        <div className="id-card-image-container">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 45vw, 280px"
            className="id-card-image"
            priority
          />
        </div>
      </div>
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
          IDENTITAS PROFESIONAL & KOMUNITAS
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
