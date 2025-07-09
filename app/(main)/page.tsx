import { ExperienceSection } from '@/components/landing/experience-section';
import { HeroSection } from '@/components/landing/hero-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <div id="experience">
          <ExperienceSection />
        </div>
      </main>
    </div>
  );
}
