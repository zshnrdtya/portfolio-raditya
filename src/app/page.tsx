import AmbientCanvas from "@/components/primitives/AmbientCanvas";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import MetricsSection from "@/components/sections/MetricsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TechSection from "@/components/sections/TechSection";
import JourneySection from "@/components/sections/JourneySection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#08090C] text-[#F1F5F9]">
      {/* Canvas Partikel Spasial 3D Interaktif */}
      <AmbientCanvas />

      {/* Header & Navigasi Floating */}
      <Navbar />

      {/* Rangkaian Section Utama */}
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <MetricsSection />
        <ProjectsSection />
        <TechSection />
        <JourneySection />
        <ContactSection />
      </main>

      {/* Footer Minimalis */}
      <Footer />
    </div>
  );
}
