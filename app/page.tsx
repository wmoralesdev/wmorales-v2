import { About } from "@/components/home/about";
import { AiLabs } from "@/components/home/ai-labs";
import { Community } from "@/components/home/community";
import { CtaBand } from "@/components/home/cta-band";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { MobileBookBar } from "@/components/home/mobile-book-bar";
import { Services } from "@/components/home/services";
import { Shelf } from "@/components/home/shelf";
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
        <AiLabs />
        <Shelf />
        <Community />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
      <MobileBookBar />
    </>
  );
}
