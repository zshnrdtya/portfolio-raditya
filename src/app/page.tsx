import Hero from "@/components/sections/Hero";
import Statistics from "@/components/sections/Statistics";
import TechSlider from "@/components/sections/TechSlider";
import Experience from "@/components/sections/Experience";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import AboutMe from "@/components/sections/AboutMe";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      <TechSlider />
      <Experience />
      <FeaturedProjects />
      <AboutMe />
      <Testimonials />
      <Contact />
    </>
  );
}
