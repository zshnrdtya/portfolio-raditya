import React from 'react';
import Image from 'next/image';

const Experience = () => {
  const experiences = [
    {
      title: "Founder & Project Manager",
      company: "Z - Project",
      description: "Founded and managed Z - Project, a professional digital and academic service platform focusing on academic paper writing, interactive PowerPoint (PPT) presentation design, and ATS-friendly Curriculum Vitae (CV) creation for students and professionals.",
      badges: ["Project Management", "Document Design", "CV Creation", "PPT Presentation"],
      logo: "/foto-raditya/logo zz.png",
      logoPosition: "left"
    },
    {
      title: "Assistant Coach & Head of Equipment",
      company: "Al-Hidayah Marching Band (2024 - 2025)",
      description: "Responsible for managing equipment, as well as training and leading marching band members to maintain synchronization, discipline, and maximum performance in every event.",
      badges: ["Leadership", "Team Management", "Event Organizing", "Problem Solving"],
      logo: "/foto-raditya/logombalhid.jpg",
      logoPosition: "right"
    },
    {
      title: "FullStack Developer (Internship)",
      company: "Indi Technology",
      description: "Responsible as a FullStack Developer intern at Indi Technology in developing a modern company profile application. Actively implemented 3D scrollytelling interactive features, managed the application deployment process to the production environment, and comprehensively conducted Quality Assurance (QA) testing to ensure optimal and bug-free system performance.",
      badges: ["Next.js", "React", "Laravel", "Inertia.js"],
      logo: "/foto-raditya/logoindi.png",
      logoPosition: "left"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-surface">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-poppins text-textMain" data-aos="fade-up">
          Experience & Leadership
        </h2>

        <div className="relative">
          {/* Main vertical line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-surface shadow-neu-in rounded-full"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                data-aos="fade-up"
              >
                {/* Timeline node */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)] z-10 border-4 border-surface"></div>

                {/* Content */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                  <div className="bg-surface shadow-neu-out rounded-3xl p-6 md:p-8 hover:shadow-[10px_10px_20px_rgba(150,175,161,0.8),-10px_-10px_20px_rgba(255,255,255,1)] transition-shadow duration-300">
                    <div className={`flex flex-col sm:flex-row gap-4 mb-4 sm:items-center ${exp.logoPosition === 'left' ? 'sm:justify-start' : 'sm:flex-row-reverse sm:justify-start'}`}>
                      {exp.logo && (
                        <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden shadow-neu-in flex items-center justify-center p-1 bg-surface z-10">
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                            <Image src={exp.logo} alt={`${exp.company} logo`} fill className="object-cover" />
                          </div>
                        </div>
                      )}
                      <div className={exp.logoPosition === 'left' ? 'text-left' : 'text-left sm:text-right'}>
                        <h3 className="text-xl font-bold font-poppins text-textMain mb-1">{exp.title}</h3>
                        <h4 className="text-accent font-medium">{exp.company}</h4>
                      </div>
                    </div>
                    <p className="text-textMain/80 text-sm md:text-base leading-relaxed mb-4 text-justify">
                      {exp.description}
                    </p>
                    
                    {exp.badges.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                        {exp.badges.map((badge, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 text-xs font-medium bg-surface shadow-neu-in rounded-full text-textMain"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
