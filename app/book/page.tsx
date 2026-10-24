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
import { bookJsonLd } from "@/lib/seo";
import { BOOKING_EMBED_URL, BOOKING_URL, person } from "@/lib/site";

const title = "Agendar una llamada";
const description =
  "Reservá una llamada con Walter Morales, AI Engineer y Co-Founder de Ai Labs. Contame tu caso y salí con un diagnóstico inicial y próximos pasos claros.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book" },
  openGraph: { title, description, url: "/book", type: "website" },
  twitter: { title, description },
};

const steps: { icon: ShapeName; title: string; body: string }[] = [
  {
    icon: "calendar",
    title: "Elegí un horario",
    body: "El calendario muestra mi disponibilidad en tu zona horaria. Recibís la invitación por correo.",
  },
  {
    icon: "chat",
    title: "Contame tu contexto",
    body: "Qué querés resolver con IA, qué intentaron antes y qué datos o herramientas ya tienen.",
  },
  {
    icon: "arrow",
    title: "Salí con un plan",
    body: "Un diagnóstico inicial y próximos pasos. Si hay fit, te preparo una propuesta.",
  },
];

export default function BookPage() {
  return (
    <>
      <JsonLd data={bookJsonLd()} />
      <main
        id="contenido"
        className="relative z-10 min-h-svh bg-paper pb-24 md:pb-32"
      >
        <SiteHeader action={{ href: "/", label: "Volver al inicio" }} />
        <Reveal className="grid gap-12 px-4 pt-12 sm:px-7 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8 md:pt-20">
          <div className="md:col-span-5 md:row-start-1 lg:col-span-4">
            <h1 className="display text-[calc(clamp(2.75rem,12vw,4.25rem)*var(--display-fit)*var(--display-scale))] md:text-[calc(clamp(3rem,5.4vw,5.5rem)*var(--display-fit)*var(--display-scale))]">
              <span className="mask-line">
                <span>Agendá una</span>
              </span>
              <span
                className="mask-line"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span>llamada</span>
              </span>
            </h1>
            <p className="fade-in-late mt-6 max-w-[30rem] text-lead leading-snug">
              Hablemos de dónde la IA puede mover números en tu empresa. Sin
              compromiso y en español o inglés.
            </p>
          </div>

          <div
            data-reveal
            className="md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1 lg:col-span-8 lg:col-start-5"
          >
            <BookingFrame src={BOOKING_EMBED_URL} fallback={BOOKING_URL} />
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
              ¿Preferís escribir?{" "}
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
      <SiteFooter />
    </>
  );
}
