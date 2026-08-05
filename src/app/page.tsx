import Hero from "@/components/sections/Hero";
import TechSlider from "@/components/sections/TechSlider";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import DesignCorner from "@/components/sections/DesignCorner";
import AboutMe from "@/components/sections/AboutMe";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TechSlider />
      <FeaturedProjects />
      <DesignCorner />
      <AboutMe />
      <Contact />
    </>
  );
}
