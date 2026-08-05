import Image from "next/image";

export default function TechSlider() {
  const technologies = [
    { name: "Android", file: "android.jpeg" },
    { name: "CSS", file: "css.jpeg" },
    { name: "Figma", file: "figma.jpeg" },
    { name: "Git", file: "git.jpeg" },
    { name: "GitHub", file: "github.jpeg" },
    { name: "HTML", file: "html.jpeg" },
    { name: "Java", file: "java.jpeg" },
    { name: "JavaScript", file: "js.jpeg" },
    { name: "Kotlin", file: "kotlin.jpeg" },
    { name: "Laragon", file: "laragon.jpeg" },
    { name: "Laravel", file: "laravel.jpeg" },
    { name: "MySQL", file: "mysql.jpeg" },
    { name: "Next.js", file: "nextjs.jpeg" },
    { name: "PHP", file: "php.jpeg" },
    { name: "phpMyAdmin", file: "phpmy.jpeg" },
    { name: "Postman", file: "postman.jpeg" },
    { name: "React", file: "react.jpeg" },
    { name: "Tailwind CSS", file: "tailwind.jpeg" },
    { name: "VS Code", file: "vscode.jpeg" }
  ];

  // We duplicate the array exactly twice to ensure seamless -50% translation infinite looping
  const duplicatedTech = [...technologies, ...technologies];

  return (
    <section id="skills" className="pt-0 pb-16 relative bg-[var(--color-surface)] overflow-hidden">

      <div className="relative w-full flex items-center py-4">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Container */}
        <div className="flex items-center animate-[marquee_40s_linear_infinite] w-[max-content]">
          {duplicatedTech.map((tech, index) => (
            <div 
              key={index} 
              className="mx-4 md:mx-6 flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-neu-out)] group-hover:shadow-[var(--shadow-neu-in)] transition-all duration-300 flex items-center justify-center p-6">
                <div className="relative w-full h-full">
                  <Image 
                    src={`/logo-asset/${tech.file}`}
                    alt={`${tech.name} logo`}
                    fill
                    className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    sizes="80px"
                  />
                </div>
              </div>
              <span className="mt-6 font-poppins font-bold text-sm md:text-base text-[var(--color-textMain)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-accent)] transition-all duration-300 whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
