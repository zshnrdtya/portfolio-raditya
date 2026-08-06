import SplashScreen from "@/components/ui/SplashScreen";
import Hero from "@/components/sections/Hero";
import Statistics from "@/components/sections/Statistics";
import TechSlider from "@/components/sections/TechSlider";
import Experience from "@/components/sections/Experience";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import DesignCorner from "@/components/sections/DesignCorner";
import AboutMe from "@/components/sections/AboutMe";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      <SplashScreen />
      <Hero />
      <Statistics />
      <TechSlider />
      <Experience />
      <FeaturedProjects />
      <DesignCorner />
      <AboutMe />
      <Testimonials />
      <Contact />
    </main>
  );
}
