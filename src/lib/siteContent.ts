export interface HeroContent {
  greeting: string;
  name: string;
  tagline: string;
  roles: string[];
}

export interface StatisticsContent {
  projectsCompleted: number;
  yearsLearning: number;
  coreTechnologies: number;
  internshipExperience: number;
}

export interface AboutContent {
  heading: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  location: string;
}

export interface SiteContentMap {
  hero: HeroContent;
  statistics: StatisticsContent;
  about: AboutContent;
  contact: ContactContent;
}

export type SectionKey = keyof SiteContentMap;

export const DEFAULT_SITE_CONTENT: SiteContentMap = {
  hero: {
    greeting: "Hi, I am",
    name: "Raditya Rai Zeeshan",
    tagline: "Founder & Lead Developer at Z - Project",
    roles: [
      "Fullstack Developer",
      "UI/UX Designer",
      "Founder of Z - Project",
    ],
  },
  statistics: {
    projectsCompleted: 10,
    yearsLearning: 2,
    coreTechnologies: 5,
    internshipExperience: 1,
  },
  about: {
    heading: "About Me",
    bioParagraph1:
      "My name is Raditya Rai Zeeshan, a 17-year-old Software and Game Development (PPLG) student at SMKN 1 Depok. Since being introduced to programming, I have been fascinated by how digital systems can provide meaningful, real-world solutions.",
    bioParagraph2:
      "I am a Full-Stack Developer and the Founder of Z - Project, specializing in building interactive websites, mobile applications, and premium user interfaces. My technical journey is balanced by a strong foundation in leadership and teamwork, shaped by my experience as an Assistant Coach in the Al-Hidayah Marching Band.",
    bioParagraph3:
      "Whether I am structuring a complex database or orchestrating a team, my philosophy remains the same: \"It's not the problem that is flawed; fix the mindset, and the problem solves itself.\"",
  },
  contact: {
    title: "Get In Touch",
    subtitle:
      "Have a project in mind or want to collaborate? Feel free to reach out!",
    email: "radityaraizeeshan@gmail.com",
    location: "Jl. Pekapuran, Gg Ancin RT 04/24",
  },
};
