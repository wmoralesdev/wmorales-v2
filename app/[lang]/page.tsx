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
import { path } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { homeJsonLd } from "@/lib/seo";

export default async function Home() {
  const t = await getDictionary();
  const book = path(t.lang, "book");
  return (
    <>
      <JsonLd data={homeJsonLd(t.lang)} />
      <main id="contenido" className="relative z-10 bg-paper">
        <Hero
          t={t.hero}
          book={{ href: book, label: t.bookCall }}
          home={path(t.lang, "home")}
        />
        <About />
        <Services />
        <Experience />
        <Community />
        <Faq />
        <CtaBand t={t.cta} href={book} />
      </main>
      <SiteFooter route="home" />
      <MobileBookBar href={book} label={t.bookCall} />
    </>
  );
}
