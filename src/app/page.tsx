import { MeshGradient } from '@/components/effects/MeshGradient';
import { CursorGlow } from '@/components/effects/CursorGlow';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { CardTilt } from '@/components/effects/CardTilt';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <MeshGradient />
      <CursorGlow />
      <Navbar />

      <main>
        <ScrollReveal>
          <CardTilt>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <EducationSection />
            <ContactSection />
          </CardTilt>
        </ScrollReveal>
      </main>

      <Footer />
    </>
  );
}
