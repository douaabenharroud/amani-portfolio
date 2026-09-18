import Navbar from "@/components/navbar";
import HomeSection from "@/components/sections/HomeSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-dark-text)',
      }}
    >
      <Navbar />

      <main>
        <HomeSection />
        {/* <AboutSection /> */}
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  );
}