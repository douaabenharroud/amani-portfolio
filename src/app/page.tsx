import Navbar from "@/components/navbar";
import HomeSection from "@/components/sections/HomeSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-dark-text)]">
      <Navbar />

      <main>
        <HomeSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
          <ContactSection />
      </main>
    </div>
  );
}