import { Mail01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { BookingFrame } from "@/components/book/booking-frame";
import { HalftoneIcon } from "@/components/halftone-icon";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ShapeName } from "@/lib/halftone-shapes";
import { path } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { bookJsonLd, pageMetadata } from "@/lib/seo";
import { BOOKING_EMBED_URL, BOOKING_URL, person } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { book } = await getDictionary();
  const meta = pageMetadata(lang, "book", book);
  return { ...meta, openGraph: { ...meta.openGraph, type: "website" } };
}

const icons: ShapeName[] = ["calendar", "chat", "arrow"];

export default async function BookPage() {
  const t = await getDictionary();
  const steps = t.book.steps.map((s, i) => ({ ...s, icon: icons[i] }));
  // hl puts Google's calendar UI in the page's language.
  const embed = new URL(BOOKING_EMBED_URL);
  embed.searchParams.set("hl", t.lang);
  return (
    <>
      <JsonLd data={bookJsonLd(t.lang)} />
      <main
        id="contenido"
        className="relative z-10 min-h-svh bg-paper pb-24 md:pb-32"
      >
        <SiteHeader
          home={path(t.lang, "home")}
          action={{ href: path(t.lang, "home"), label: t.backHome, back: true }}
        />
        <Reveal className="grid gap-12 px-4 pt-12 sm:px-7 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8 md:pt-20">
          <div className="md:col-span-5 md:row-start-1 lg:col-span-4">
            <h1 className="display text-[clamp(2.75rem,12vw,4.25rem)] md:text-[clamp(3rem,5.4vw,5.5rem)]">
              <span className="mask-line">
                <span>{t.book.heading[0]}</span>
              </span>
              <span
                className="mask-line"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span>{t.book.heading[1]}</span>
              </span>
            </h1>
            <p className="fade-in-late mt-6 max-w-[30rem] text-lead leading-snug">
              {t.book.lead}
            </p>
          </div>

          <div
            data-reveal
            className="md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1 lg:col-span-8 lg:col-start-5"
          >
            <BookingFrame
              src={embed.toString()}
              fallback={BOOKING_URL}
              t={t.book.frame}
            />
          </div>

          <div className="md:col-span-5 md:row-start-2 lg:col-span-4">
            <ol className="space-y-7">
              {steps.map((s) => (
                <li
                  key={s.title}
                  data-reveal
                  data-icon-hover
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4"
                >
                  <HalftoneIcon
                    shape={s.icon}
                    grid={7}
                    motion="hover"
                    className="size-10 text-accent"
                  />
                  <div>
                    <h2 className="font-semibold text-body">{s.title}</h2>
                    <p className="mt-1 text-muted text-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p data-reveal className="mt-12 text-body">
              {t.book.write}{" "}
              <a
                href={`mailto:${person.email}`}
                className="link-underline inline-flex items-center gap-1.5 font-semibold"
              >
                <Icon icon={Mail01Icon} size={18} />
                {person.email}
              </a>
            </p>
          </div>
        </Reveal>
      </main>
      <SiteFooter route="book" />
    </>
  );
}
