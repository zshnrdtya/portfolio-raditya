import Image from "next/image";

export default function AboutMe() {
  const timeline = [
    {
      period: "2024 - Present",
      school: "SMKN 1 Depok (PPLG)",
      description: "Studying Software and Game Development in depth. Actively honing logic, algorithms, and modern web and mobile technology skills.",
      logo: "logo smkn 1 depok.png"
    },
    {
      period: "2021 - 2024",
      school: "MTs Alhidayah Sukatani",
      description: "Completed junior high school with a strong academic foundation before focusing on technology.",
      logo: "logo mts alhidayah.jpg"
    },
    {
      period: "2015 - 2021",
      school: "SDN Sukatani 7",
      description: "Successfully completed elementary education.",
      logo: "logo sdn sukatani7.jpg"
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Profile & Bio Section */}
          <div className="w-full lg:w-5/12">
            <h2 className="font-poppins font-black text-4xl md:text-5xl text-[var(--color-textMain)] inline-block relative mb-12 pb-2 drop-shadow-sm">
              About Me
            </h2>
            
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-neu-out)] mb-10 p-3 bg-[var(--color-surface)]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)]">
                <Image 
                  src="/foto-raditya/raditya.jpeg" 
                  alt="Raditya Rai Zeeshan"
                  fill
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            
            <div className="font-inter text-[var(--color-textMain)] font-medium leading-relaxed text-lg bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-2xl p-6 text-justify">
              <p>
                My name is <strong className="font-black text-[var(--color-accent)]">Raditya Rai Zeeshan</strong>, I am 17 years old, born on October 30, 2008. 
                I am a Software and Game Development (PPLG) student with a strong interest in technology, 
                particularly in website and application development.
              </p>
              <p className="mt-4">
                Since being introduced to programming, I have been fascinated by how digital systems can be built and utilized to provide meaningful solutions.
              </p>
            </div>
          </div>
          
          {/* Timeline Section */}
          <div className="w-full lg:w-7/12 lg:pt-24">
            <h3 className="font-poppins font-black text-3xl text-[var(--color-textMain)] mb-12 drop-shadow-sm">Education History</h3>
            
            <div className="relative ml-3 md:ml-4 space-y-12">
              {/* Recessed Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-full"></div>

              {timeline.map((item, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group">
                  {/* Timeline embossed dot */}
                  <div className="absolute -left-[6px] top-2 w-4 h-4 rounded-full bg-[var(--color-accent)] shadow-[var(--shadow-neu-out)] 
                                group-hover:scale-125 transition-transform duration-300 z-10"></div>
                  
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] transition-shadow duration-300 relative">
                    
                    {/* School Logo */}
                    {item.logo && (
                      <div className="absolute top-6 right-6 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shadow-[var(--shadow-neu-in)] p-[2px] bg-[var(--color-surface)]">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                          <Image 
                            src={`/logo-sekolah/${item.logo}`} 
                            alt={`${item.school} logo`}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        </div>
                      </div>
                    )}

                    <span className="inline-block px-4 py-2 bg-[var(--color-surface)] text-[var(--color-accent)] text-sm font-bold shadow-[var(--shadow-neu-in)] rounded-full mb-4">
                      {item.period}
                    </span>
                    <h4 className="font-poppins font-black text-2xl text-[var(--color-textMain)] mb-3 pr-16 md:pr-20">{item.school}</h4>
                    <p className="font-inter text-lg font-medium text-[var(--color-textMain)] leading-relaxed opacity-80 text-justify">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
