"use client";

import React from 'react';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      title: "Juara 3 Umum Marching Band",
      event: "Jungle Marching Adventure #7",
      role: "Snare Player",
      year: "2023",
    },
    {
      title: "Juara 3 Umum Marching Band",
      event: "Islamic Solidarity Marching Competition",
      role: "Snare Player",
      year: "2023",
    },
    {
      title: "Juara 2 Umum Marching Band",
      event: "Islamic Marching Band Competition",
      role: "Asisten Pelatih",
      year: "2024",
    },
    {
      title: "Juara 4 Umum Drum Battle",
      event: "Kejuaraan Daerah (Kejurda) DKI Jakarta",
      role: "Snare Player",
      year: "2025",
    },
    {
      title: "Juara 2 Umum Drum Battle",
      event: "Patriot Competition Marching Band",
      role: "Snare Player",
      year: "2025",
    },
  ];

  return (
    <section id="achievements" className="py-20 bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-poppins text-slate-900" data-aos="fade-up">
          Achievements
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          {achievements.map((item, index) => (
            <div 
              key={index} 
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-surface shadow-neu-out rounded-3xl p-6 md:p-8 hover:shadow-[10px_10px_20px_rgba(150,175,161,0.8),-10px_-10px_20px_rgba(255,255,255,1)] transition-shadow duration-300 flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 shrink-0 rounded-full shadow-neu-in flex items-center justify-center bg-surface">
                  <Trophy className="w-7 h-7 text-textMain" />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg md:text-xl font-bold font-poppins text-textMain leading-snug mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.event}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center gap-3">
                <span className="px-4 py-2 text-xs md:text-sm font-semibold shadow-neu-out rounded-full text-textMain flex-1 text-center bg-surface truncate">
                  {item.role}
                </span>
                <span className="px-5 py-2 text-xs md:text-sm font-bold shadow-neu-out rounded-full text-accent bg-surface">
                  {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
