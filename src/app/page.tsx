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
        
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8">
          <ProjectsSection />
          <SkillsSection />
          <AboutSection />
          <ContactSection />
        </div>
      </main>
    </div>
  );
}