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
import {
  CONSULTANT_DESCRIPTION,
  CONSULTANT_PATH,
  CONSULTANT_TITLE,
  consultantJsonLd,
} from "@/lib/seo";
import {
  aiLabs,
  ambassadorships,
  consultantFaqs,
  person,
  photos,
  services,
} from "@/lib/site";

// Landing for the "consultor de IA" query. Deliberately left out of the hero and
// the navigation: the sitemap and search results are its only way in.
export const metadata: Metadata = {
  title: CONSULTANT_TITLE,
  description: CONSULTANT_DESCRIPTION,
  alternates: { canonical: CONSULTANT_PATH },
  openGraph: {
    title: `${CONSULTANT_TITLE} · Walter Morales`,
    description: CONSULTANT_DESCRIPTION,
    url: CONSULTANT_PATH,
    type: "website",
  },
  twitter: {
    title: `${CONSULTANT_TITLE} · Walter Morales`,
    description: CONSULTANT_DESCRIPTION,
  },
};

const figures = [
  { value: 6, suffix: "+", label: "años construyendo software" },
  { value: 1, suffix: "K+", label: "builders en la comunidad" },
  { value: 75, suffix: "+", label: "eventos realizados" },
  { value: 3, suffix: "K+", label: "asistentes diferentes" },
];

const steps: { icon: ShapeName; title: string; body: string }[] = [
  {
    icon: "chat",
    title: "Llamada inicial",
    body: "Me contás qué querés resolver, qué intentaron antes y con qué datos cuentan. Sin costo.",
  },
  {
    icon: "target",
    title: "Diagnóstico",
    body: "Dónde la IA mueve números en tu operación, ordenado por valor y esfuerzo.",
  },
  {
    icon: "tiles",
    title: "Propuesta",
    body: "Alcance, tiempos y entregables cerrados antes de empezar. Sin sorpresas.",
  },
  {
    icon: "sparkle",
    title: "Implementación",
    body: "Agentes, producto o adopción en tu equipo, medidos contra el objetivo del diagnóstico.",
  },
];

export default function ConsultantPage() {
  return (
    <>
      <JsonLd data={consultantJsonLd()} />
      <main id="contenido" className="relative z-10 bg-paper">
        <SiteHeader />

        {/* Intro */}
        <Reveal
          as="section"
          aria-labelledby="consultor-title"
          className="grid gap-12 px-4 pt-12 pb-24 sm:px-7 md:grid-cols-12 md:gap-x-8 md:pt-20 md:pb-32"
        >
          <div className="md:col-span-7">
            <p data-reveal className="text-muted text-small">
              {person.name} · {person.headline}
            </p>
            <h1
              id="consultor-title"
              className="display mt-4 text-[clamp(2.75rem,11vw,4.25rem)] md:text-[clamp(3.5rem,6vw,6.5rem)]"
            >
              <span className="mask-line">
                <span>Consultor de IA</span>
              </span>
              <span
                className="mask-line"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span>en El Salvador</span>
              </span>
            </h1>
            <p className="fade-in-late mt-8 max-w-[38rem] text-lead leading-snug">
              Ayudo a empresas de El Salvador, Latinoamérica y Estados Unidos a
              pasar de experimentar con inteligencia artificial a operarla:
              estrategia, agentes y capacitación, con el respaldo de los
              programas de embajadores de SpaceXAI, OpenAI, Mistral y Cognition.
            </p>
            <div className="fade-in-late mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/book" className="btn">
                Agendar llamada
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
              photo={photos.portrait}
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
              Embajador de los laboratorios que construyen la IA
            </h2>
            <p
              data-reveal
              className="max-w-[34rem] text-body opacity-80 md:col-span-5 md:self-end"
            >
              Un consultor de IA que solo lee anuncios llega tarde. Como
              embajador pruebo los modelos y agentes antes y a fondo, conozco
              sus límites reales y llevo a tu equipo lo que de verdad funciona.
            </p>
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {ambassadorships.map((a) => (
              <li
                key={a.name}
                data-reveal
                className="border-paper/20 border-t pt-6"
              >
                <HalftoneLogo
                  src={a.logo}
                  className="mb-8 size-20 text-accent"
                />
                <p className="text-small opacity-70">{a.host}</p>
                <h3 className="display mt-1 text-[clamp(1.75rem,1.4rem+1vw,2.375rem)] leading-[0.95]">
                  {a.role}
                </h3>
                <p className="mt-1 font-semibold text-body">{a.name}</p>
                <p className="mt-4 text-body opacity-80">{a.line}</p>
              </li>
            ))}
          </ul>
          <p
            data-reveal
            className="mt-16 max-w-[46rem] text-body opacity-80 md:mt-20"
          >
            La comunidad empezó en 2025 como Cursor Ambassador en El Salvador y
            hoy reúne a más de mil builders en talleres, hackathons y meetups.
          </p>
        </Reveal>

        {/* Figures */}
        <Reveal
          as="section"
          aria-label="Comunidad en números"
          className="px-2 pt-2"
        >
          <dl className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
            {figures.map((f, i) => (
              <div
                key={f.label}
                data-reveal
                className={`grid aspect-square place-items-center p-3 text-center sm:aspect-[4/3] ${
                  i % 2 ? "bg-lilac text-ink" : "bg-accent text-snow"
                }`}
              >
                <dt className="order-last text-small leading-tight">
                  {f.label}
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
            Qué incluye la consultoría de IA
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.name}
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
                  {s.name}
                </h3>
                <p className="mt-3 max-w-[38ch] text-muted text-body">
                  {s.description}
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
            Cómo es trabajar conmigo
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
              aria-label={`Logotipo de ${aiLabs.name}`}
              data-reveal
              className="aspect-[1295/324] w-52 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
            />
            <h2
              id="ai-labs-title"
              data-reveal
              className="display mt-8 text-head"
            >
              Cuando hay que construir
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end">
            <p data-reveal className="text-lead leading-snug">
              Si el proyecto pide producto y no solo estrategia, lo ejecutamos
              con {aiLabs.name}, el estudio de IA que cofundé en El Salvador:
              del prototipo al software en producción, con el mismo criterio de
              la consultoría.
            </p>
            <a
              href={aiLabs.url}
              target="_blank"
              rel="noopener"
              data-reveal
              className="link-underline mt-8 inline-flex items-center gap-1.5 font-semibold text-body"
            >
              Conocé {aiLabs.name}
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
              Preguntas sobre consultoría de IA
            </h2>
            <div className="mt-12 space-y-2 md:col-span-8 md:col-start-5 md:mt-0 md:space-y-4">
              {consultantFaqs.map((f) => (
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

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
