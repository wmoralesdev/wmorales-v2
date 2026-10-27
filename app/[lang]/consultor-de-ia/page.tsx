import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { HalftonePhoto } from "@/components/halftone-photo";
import { CtaBand } from "@/components/home/cta-band";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ShapeName } from "@/lib/halftone-shapes";
import { path } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { consultantJsonLd, pageMetadata } from "@/lib/seo";
import {
  aiLabs,
  ambassadorships,
  consultantFaqs,
  person,
  photo,
  services,
  stats,
} from "@/lib/site";

// Landing for the "consultor de IA" / "AI consultant" query, served at
// /consultor-de-ia and /en/ai-consultant. Deliberately left out of the hero and the
// navigation: the sitemap and search results are its only way in.
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { consultant } = await getDictionary();
  const meta = pageMetadata(lang, "consultant", consultant);
  const title = `${consultant.title} · Walter Morales`;
  return {
    ...meta,
    openGraph: { ...meta.openGraph, title, type: "website" },
    twitter: { ...meta.twitter, title },
  };
}

const icons: ShapeName[] = ["chat", "target", "tiles", "sparkle"];

export default async function ConsultantPage() {
  const t = await getDictionary();
  const c = t.consultant;
  const lang = t.lang;
  const steps = c.steps.map((s, i) => ({ ...s, icon: icons[i] }));
  return (
    <>
      <JsonLd data={consultantJsonLd(lang)} />
      <main id="contenido" className="relative z-10 bg-paper">
        <SiteHeader
          home={path(lang, "home")}
          action={{ href: path(lang, "book"), label: t.bookCall }}
        />

        {/* Intro */}
        <Reveal
          as="section"
          aria-labelledby="consultor-title"
          className="grid gap-12 px-4 pt-12 pb-24 sm:px-7 md:grid-cols-12 md:gap-x-8 md:pt-20 md:pb-32"
        >
          <div className="md:col-span-7">
            <p data-reveal className="text-muted text-small">
              {person.name} · {person.headline[lang]}
            </p>
            <h1
              id="consultor-title"
              className="display mt-4 text-[clamp(2.75rem,11vw,4.25rem)] md:text-[clamp(3.5rem,6vw,6.5rem)]"
            >
              <span className="mask-line">
                <span>{c.heading[0]}</span>
              </span>
              <span
                className="mask-line"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span>{c.heading[1]}</span>
              </span>
            </h1>
            <p className="fade-in-late mt-8 max-w-[38rem] text-lead leading-snug">
              {c.lead}
            </p>
            <div className="fade-in-late mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href={path(lang, "book")} className="btn">
                {t.bookCall}
              </Link>
              <a
                href={`mailto:${person.email}`}
                className="link-underline inline-flex items-center gap-1.5 font-semibold text-body"
              >
                <Icon icon={Mail01Icon} size={18} />
                {person.email}
              </a>
            </div>
          </div>
          <div className="relative max-w-[26rem] md:col-span-4 md:col-start-9">
            <HalftonePhoto
              photo={photo("portrait", lang)}
              tone="bg-lilac text-accent"
              className="aspect-[864/1184]"
              sizes="(min-width: 768px) 30vw, 90vw"
              priority
            />
          </div>
        </Reveal>

        {/* Ambassadorships */}
        <Reveal
          as="section"
          aria-labelledby="embajador-title"
          className="bg-ink px-4 py-24 text-paper sm:px-7 md:py-32"
        >
          <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-8">
            <h2
              id="embajador-title"
              data-reveal
              className="display text-head md:col-span-7"
            >
              {c.ambassadorTitle}
            </h2>
            <p
              data-reveal
              className="max-w-[34rem] text-body opacity-80 md:col-span-5 md:self-end"
            >
              {c.ambassadorBody}
            </p>
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {ambassadorships.map((a) => (
              <li
                key={a.name}
                data-reveal
                data-icon-hover
                className="border-paper/20 border-t pt-6"
              >
                <HalftoneLogo
                  name={a.logo}
                  className="mb-8 size-20 text-accent"
                />
                <p className="text-small opacity-70">{a.host}</p>
                <h3 className="display mt-1 text-[clamp(1.75rem,1.4rem+1vw,2.375rem)] leading-[0.95]">
                  {a.role}
                </h3>
                <p className="mt-1 font-semibold text-body">{a.name}</p>
                <p className="mt-4 text-body opacity-80">{a.line[lang]}</p>
              </li>
            ))}
          </ul>
          <p
            data-reveal
            className="mt-16 max-w-[46rem] text-body opacity-80 md:mt-20"
          >
            {c.communityNote}
          </p>
        </Reveal>

        {/* Figures */}
        <Reveal as="section" aria-label={c.figures} className="px-2 pt-2">
          <dl className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
            {stats.map((f, i) => (
              <div
                key={f.value}
                data-reveal
                className={`grid aspect-square place-items-center p-3 text-center sm:aspect-[4/3] ${
                  i % 2 ? "bg-lilac text-ink" : "bg-accent text-snow"
                }`}
              >
                <dt className="order-last text-small leading-tight">
                  {f.label[lang]}
                </dt>
                <dd className="display text-[15vw] leading-none sm:text-[clamp(2.75rem,6.4vw,7rem)] lg:text-[clamp(2.75rem,5vw,6rem)]">
                  <span data-count={f.value}>{f.value}</span>
                  {f.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Services */}
        <Reveal
          as="section"
          aria-labelledby="servicios-title"
          className="px-4 py-24 sm:px-7 md:py-32"
        >
          <h2 id="servicios-title" data-reveal className="display text-head">
            {c.servicesTitle}
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.name.es}
                data-reveal
                data-icon-hover
                className="border-ink/15 border-t pt-5"
              >
                <HalftoneIcon
                  shape={s.icon}
                  motion="hover"
                  className="mb-6 size-16 text-accent"
                />
                <h3 className="display text-[clamp(1.75rem,1.4rem+1vw,2.375rem)] leading-[0.95]">
                  {s.name[lang]}
                </h3>
                <p className="mt-3 max-w-[38ch] text-muted text-body">
                  {s.description[lang]}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Process */}
        <Reveal
          as="section"
          aria-labelledby="proceso-title"
          className="bg-surface px-4 py-24 sm:px-7 md:py-32"
        >
          <h2 id="proceso-title" data-reveal className="display text-head">
            {c.processTitle}
          </h2>
          <ol className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                data-reveal
                data-icon-hover
                className="border-ink/15 border-t pt-5"
              >
                <div className="mb-6 flex items-start justify-between">
                  <HalftoneIcon
                    shape={s.icon}
                    grid={7}
                    motion="hover"
                    className="size-12 text-accent"
                  />
                  <span className="text-muted text-small tabular-nums">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-body">{s.title}</h3>
                <p className="mt-1 text-muted text-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Ai Labs */}
        <Reveal
          as="section"
          aria-labelledby="ai-labs-title"
          className="grid gap-y-8 px-4 py-24 sm:px-7 md:grid-cols-12 md:gap-x-8 md:py-32"
        >
          <div className="md:col-span-5">
            <div
              role="img"
              aria-label={t.logo(aiLabs.name)}
              data-reveal
              className="aspect-[1295/324] w-52 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
            />
            <h2
              id="ai-labs-title"
              data-reveal
              className="display mt-8 text-head"
            >
              {c.buildTitle}
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end">
            <p data-reveal className="text-lead leading-snug">
              {c.buildBody(aiLabs.name)}
            </p>
            <a
              href={aiLabs.url}
              target="_blank"
              rel="noopener"
              data-reveal
              className="link-underline mt-8 inline-flex items-center gap-1.5 font-semibold text-body"
            >
              {c.buildLink(aiLabs.name)}
              <Icon icon={ArrowUpRight01Icon} size={18} />
            </a>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal
          as="section"
          aria-labelledby="preguntas-title"
          className="border-ink/15 border-t px-4 py-24 sm:px-7 md:py-40"
        >
          <div className="md:grid md:grid-cols-12 md:gap-x-8">
            <h2
              id="preguntas-title"
              data-reveal
              className="display text-head md:col-span-4"
            >
              {c.faqTitle}
            </h2>
            <div className="mt-12 space-y-2 md:col-span-8 md:col-start-5 md:mt-0 md:space-y-4">
              {consultantFaqs[lang].map((f) => (
                <details
                  key={f.q}
                  data-reveal
                  className="group -mx-4 px-4 py-4 transition-colors duration-200 open:bg-surface sm:-mx-6 sm:px-6 sm:py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.1875rem] leading-snug md:text-[1.4375rem] [&::-webkit-details-marker]:hidden">
                    <h3 className="font-normal">{f.q}</h3>
                    <Icon
                      icon={ArrowDown01Icon}
                      size={24}
                      strokeWidth={2}
                      className="shrink-0 transition-transform duration-300 ease-(--ease-out) group-open:-rotate-180"
                    />
                  </summary>
                  <p className="max-w-[56ch] pt-4 text-[1rem] md:text-[1.0625rem]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        <CtaBand t={t.cta} href={path(lang, "book")} />
      </main>
      <SiteFooter route="consultant" />
    </>
  );
}
