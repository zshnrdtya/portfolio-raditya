export default function Contact() {
  const contactInfo = [
    {
      type: "link",
      title: "Email",
      value: "radityaraizeeshan@gmail.com",
      link: "mailto:radityaraizeeshan@gmail.com",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      type: "map",
      title: "Location",
      value: "Jl. Pekapuran, Gg Ancin RT 04/24",
      link: "https://maps.google.com/maps?q=Jl.+Pekapuran,+Kota+Depok,+Jawa+Barat&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  ];

  return (
    <section id="contact" className="py-24 relative bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="font-poppins font-black text-4xl md:text-5xl text-[var(--color-textMain)] inline-block relative mb-6 drop-shadow-sm">
          Let's Connect
        </h2>
        
        <p className="font-inter font-medium text-lg text-[var(--color-textMain)] mb-16 max-w-2xl mx-auto bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-2xl p-6">
          Have a project in mind or just want to say hi? Feel free to reach out to me directly through any of the channels below!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {contactInfo.map((info, index) => (
            info.type === "map" ? (
              <div 
                key={index}
                className="bg-[var(--color-surface)] rounded-3xl p-6 shadow-[var(--shadow-neu-out)] flex flex-col gap-4"
              >
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)] p-2 bg-[var(--color-surface)]">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <iframe 
                      src={info.link} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                </div>
                <div className="text-center mt-auto pb-2">
                  <h3 className="font-poppins font-black text-xl text-[var(--color-textMain)] mb-1">
                    {info.title}
                  </h3>
                  <p className="font-inter font-medium text-[var(--color-textMain)] opacity-80 text-sm">
                    {info.value}
                  </p>
                </div>
              </div>
            ) : (
              <a 
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[var(--color-surface)] rounded-3xl p-8 shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] group-hover:shadow-[var(--shadow-neu-in)] group-hover:text-[var(--color-accent)] text-[var(--color-textMain)] flex items-center justify-center transition-all duration-300">
                  {info.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-poppins font-black text-xl text-[var(--color-textMain)] mb-2">
                    {info.title}
                  </h3>
                  <p className="font-inter font-medium text-[var(--color-textMain)] opacity-80 group-hover:opacity-100 transition-opacity">
                    {info.value}
                  </p>
                </div>
              </a>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
