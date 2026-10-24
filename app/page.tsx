import { About } from "@/components/home/about";
import { Community } from "@/components/home/community";
import { CtaBand } from "@/components/home/cta-band";
import { Experience } from "@/components/home/experience";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { MobileBookBar } from "@/components/home/mobile-book-bar";
import { Services } from "@/components/home/services";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { homeJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <main id="contenido" className="relative z-10 bg-paper">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Community />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
      <MobileBookBar />
    </>
  );
}
