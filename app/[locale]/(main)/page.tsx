import { setRequestLocale } from 'next-intl/server';
// import { ExperienceSection } from '@/components/landing/experience-section';
import { HeroSection } from '@/components/landing/hero-section';

export { metadata } from './metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      <main>
        <div id="home">
          <HeroSection />
        </div>
        {/* <div id="experience">
          <ExperienceSection />
        </div> */}
      </main>
    </div>
  );
}
