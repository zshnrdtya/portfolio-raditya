import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Raditya is a fast learner and successfully implemented modern designs and 3D technologies for our company profile application.",
      author: "Mentor PKL",
      company: "Indi Technology"
    },
    {
      quote: "The ATS-friendly CV created by Z-Project helped me land my dream job! The layout is incredibly clean and professional.",
      author: "Iqbal",
      company: "Z-Project Client"
    },
    {
      quote: "Our pitch deck was transformed entirely. The interactive PowerPoint design provided by Z-Project was outstanding and deeply engaging.",
      author: "Fizwan",
      company: "Z-Project Client"
    },
    {
      quote: "The academic writing assistance was top-notch. High-quality references, perfect formatting, and delivered right on time.",
      author: "Jonni",
      company: "Z-Project Client"
    },
    {
      quote: "The formatting and research for my academic paper were flawless. Z-Project saved me so much time and stress during my finals.",
      author: "Yazid",
      company: "Z-Project Client"
    },
    {
      quote: "Highly recommend Z-Project for any digital solutions, including custom Canva designs. The visual quality they delivered was beyond our expectations.",
      author: "Billa",
      company: "Z-Project Client"
    },
    {
      quote: "Fast response and highly reliable! My college assignments and presentation tasks were completed perfectly by the Z-Project team.",
      author: "Fakih",
      company: "Z-Project Client"
    }
  ];

  // We duplicate the array to ensure seamless -50% translation infinite looping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 bg-surface overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-6xl mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center font-poppins text-slate-900" data-aos="fade-up">
          Client Testimonials
        </h2>
      </div>

      <div className="relative w-full flex items-center py-4">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 w-16 md:w-48 h-full bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-16 md:w-48 h-full bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Container */}
        <div className="flex animate-[marquee_50s_linear_infinite] w-[max-content] hover:[animation-play-state:paused]">
          {duplicatedTestimonials.map((testi, index) => (
            <div 
              key={index} 
              className="mx-4 md:mx-6 w-[320px] md:w-[450px] shrink-0"
            >
              <div className="bg-surface shadow-neu-out rounded-3xl p-8 md:p-10 flex flex-col justify-between h-full hover:shadow-[10px_10px_20px_rgba(150,175,161,0.8),-10px_-10px_20px_rgba(255,255,255,1)] transition-shadow duration-300">
                <div className="mb-8">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-accent opacity-50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-textMain/90 italic text-base md:text-lg leading-relaxed">
                    "{testi.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full shadow-neu-in flex items-center justify-center bg-surface shrink-0">
                    <span className="font-bold text-accent font-poppins">{testi.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-textMain font-poppins">{testi.author}</h4>
                    <p className="text-xs md:text-sm text-textMain/70">{testi.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
