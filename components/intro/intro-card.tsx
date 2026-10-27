"use client";

import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  GithubIcon,
  Globe02Icon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
  Share08Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { HalftoneField } from "@/components/halftone-field";
import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { PortraitCanvas } from "@/components/home/portrait-canvas";
import { Icon } from "@/components/icon";
import { printName, weightWave } from "@/components/name-motion";
import {
  aiLabsLine,
  ambassadorships,
  experience,
  mediconecto,
  person,
  SITE_URL,
} from "@/lib/site";

gsap.registerPlugin(SplitText, useGSAP);

export type QrTarget = {
  id: string;
  label: string;
  caption: string;
  value: string;
  svg?: string;
};

const links = [
  { label: "Sitio", value: "wmorales.dev", href: "/", icon: Globe02Icon },
  {
    label: "Agendar llamada",
    value: "wmorales.dev/book",
    href: "/book",
    icon: Calendar03Icon,
  },
  {
    label: "LinkedIn",
    value: "in/wmoralesdev",
    href: person.social.linkedin,
    icon: Linkedin01Icon,
  },
  {
    label: "GitHub",
    value: "wmoralesdev",
    href: person.social.github,
    icon: GithubIcon,
  },
  {
    label: "X",
    value: "@wmoralesdev",
    href: person.social.x,
    icon: NewTwitterIcon,
  },
  {
    label: "Instagram",
    value: "@wmoralesdev",
    href: person.social.instagram,
    icon: InstagramIcon,
  },
  {
    label: "Correo",
    value: person.email,
    href: `mailto:${person.email}`,
    icon: Mail01Icon,
  },
];

const devStats = [
  { value: "6+", label: "años en software" },
  { value: "1K+", label: "builders" },
  { value: "75+", label: "eventos" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-ink/15 border-t px-4 pt-5 pb-8 sm:px-7 lg:px-12 lg:pt-7 lg:pb-12">
      <h2 className="mb-5 text-muted text-small">{title}</h2>
      {children}
    </section>
  );
}

/**
 * A pocket profile, built for a phone held out across a table: who Walter is, what
 * he runs, the programs he represents, and every way to keep in touch. The screen
 * stays awake while it's open, and the QR can point to the site, the calendar or a
 * vCard. Phones get a cover on top and a fixed action bar; from lg the cover stays
 * pinned on the left while the profile scrolls on the right.
 */
export function IntroCard({
  targets,
  vcard,
}: {
  targets: QrTarget[];
  vcard: string;
}) {
  const [active, setActive] = useState(0);
  const [shared, setShared] = useState(false);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const current = targets[active];

  // Same name motion as the home hero: it prints in as halftone, then a ripple
  // and a weight wave pass through it now and then.
  useGSAP(() => {
    const name = nameRef.current;
    if (!name) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(name, {
        type: "chars",
        charsClass: "ht-char",
      });
      name.dataset.split = "";
      const letters = split.chars.map((c) => [c as HTMLElement]);
      printName(letters);
      weightWave(letters);
      return () => {
        split.revert();
        delete name.dataset.split;
      };
    });
    return () => mm.revert();
  });

  // Keep the screen on while someone is scanning.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        lock = null;
      }
    };
    const onVisible = () => document.visibilityState === "visible" && request();
    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release();
    };
  }, []);

  function onKey(e: KeyboardEvent) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + targets.length) % targets.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function saveContact() {
    const url = URL.createObjectURL(
      new Blob([vcard], { type: "text/vcard;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "walter-morales.vcf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function share() {
    const data = {
      title: person.name,
      text: person.headline,
      url: `${SITE_URL}/intro`,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // The visitor closed the share sheet.
    }
  }

  return (
    <main
      id="contenido"
      className="min-h-svh bg-paper text-ink lg:grid lg:grid-cols-2"
    >
      {/* Cover: the portrait printed in snow ink on the accent field. Not selectable,
          so dragging across the portrait doesn't highlight the name. */}
      <header
        data-portrait-pointer
        className="relative overflow-clip bg-accent text-snow select-none lg:sticky lg:top-0 lg:h-svh"
      >
        <HalftoneField
          seed={1.3}
          fade="down"
          className="absolute inset-0 text-accent-deep"
        />
        <div className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 lg:px-10 lg:pt-8">
          <Link href="/" className="link-underline font-semibold text-small">
            wmorales.dev
          </Link>
          <p className="flex items-center gap-1 text-small">
            <Icon icon={Location01Icon} size={16} />
            {person.city}
          </p>
        </div>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.9, bounce: 0.1 }}
          className="theme-light relative ml-auto -mt-2 w-[min(82%,28rem)] [mask-composite:intersect] lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-[min(88%,72svh)] [mask-image:linear-gradient(to_right,transparent,#000_40%),linear-gradient(to_bottom,transparent,#000_25%)]"
        >
          <PortraitCanvas light className="text-snow" />
        </motion.div>
        <h1
          ref={nameRef}
          id="intro-name"
          className="hero-name display absolute bottom-4 left-4 text-[3.4rem] leading-[0.88] sm:left-7 sm:text-[4.5rem] lg:bottom-10 lg:left-10 lg:text-[clamp(4.5rem,7.5vw,8rem)]"
        >
          Walter
          <br />
          Morales
        </h1>
      </header>

      <div className="lg:pt-6">
        <div className="px-4 pt-5 pb-8 sm:px-7 lg:px-12 lg:pt-12 lg:pb-12">
          <p className="font-semibold text-lead leading-tight">
            AI Engineer y Co-Founder de Ai Labs.
          </p>
          <p className="mt-2 text-muted text-body leading-snug">
            Llevo la inteligencia artificial a producción en empresas de
            Latinoamérica, y organizo una comunidad de builders en El Salvador.
          </p>
          <div className="mt-5 grid gap-2 lg:grid-cols-[1fr_auto]">
            <Link href="/book" className="btn lg:col-span-2">
              <Icon icon={Calendar03Icon} size={18} />
              Agendar una llamada
            </Link>
            {/* From lg the action bar is gone, so its buttons live here. */}
            <button
              type="button"
              onClick={saveContact}
              className="btn hidden [--btn-bg:var(--color-ink)] [--btn-fg:var(--color-paper)] [--btn-bg-hover:var(--color-accent)] [--btn-fg-hover:var(--color-snow)] lg:inline-flex"
            >
              <Icon icon={UserAdd01Icon} size={18} />
              Guardar contacto
            </button>
            <button
              type="button"
              onClick={share}
              aria-label={shared ? "Link copiado" : "Compartir"}
              className="btn hidden aspect-square px-0 [--btn-bg:var(--color-surface)] [--btn-fg:var(--color-ink)] [--btn-bg-hover:var(--color-lilac)] [--btn-fg-hover:var(--color-ink)] lg:inline-flex"
            >
              <Icon
                icon={shared ? CheckmarkCircle02Icon : Share08Icon}
                size={18}
              />
            </button>
          </div>
        </div>

        <Section title="Ahora">
          <ul className="space-y-6">
            <li>
              <Link
                href="/#ai-labs"
                className="press grid grid-cols-[3rem_1fr_auto] items-start gap-x-4"
              >
                <HalftoneIcon shape="sparkle" className="size-12 text-accent" />
                <div>
                  <div
                    role="img"
                    aria-label="Ai Labs"
                    className="aspect-[1295/324] w-32 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
                  />
                  <p className="mt-2 font-semibold text-small">Co-Founder</p>
                  <p className="mt-0.5 text-muted text-small leading-snug">
                    {aiLabsLine}
                  </p>
                </div>
                <Icon icon={ArrowUpRight01Icon} size={18} />
              </Link>
            </li>
            <li>
              <a
                href={mediconecto.url}
                target="_blank"
                rel="noreferrer"
                className="press grid grid-cols-[3rem_1fr_auto] items-start gap-x-4"
              >
                <HalftoneIcon shape="plus" className="size-12 text-accent" />
                <div>
                  <p className="display text-[1.5rem] leading-none">
                    {mediconecto.name}
                  </p>
                  <p className="mt-2 font-semibold text-small">
                    {mediconecto.role}
                  </p>
                  <p className="mt-0.5 text-muted text-small leading-snug">
                    {mediconecto.line}
                  </p>
                </div>
                <Icon icon={ArrowUpRight01Icon} size={18} />
              </a>
            </li>
          </ul>
        </Section>

        <Section title="Embajador">
          <ul className="grid grid-cols-2 gap-1.5">
            {ambassadorships.map((a, i) => (
              <li
                key={a.name}
                data-icon-hover
                className={`group flex aspect-square flex-col justify-between p-3.5 ${
                  i === 0 ? "bg-accent text-snow" : "bg-ink text-paper"
                }`}
              >
                <HalftoneLogo
                  name={a.logo}
                  className={`size-16 ${i === 0 ? "text-snow" : "text-lilac"}`}
                />
                <div>
                  <p className="font-semibold text-body leading-tight">
                    {a.name}
                  </p>
                  <p className="mt-0.5 text-small opacity-70">{a.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Como developer">
          <dl className="grid grid-cols-3 gap-3">
            {devStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="display text-[2.25rem] leading-none text-accent">
                  {s.value}
                </dd>
                <dd className="mt-1 text-muted text-small">{s.label}</dd>
              </div>
            ))}
          </dl>
          <ol className="mt-6 divide-y divide-ink/10 border-ink/10 border-y">
            {experience.slice(1, 5).map((job) => (
              <li
                key={job.name}
                className="grid grid-cols-[2.75rem_1fr] gap-x-3 py-2.5"
              >
                <span className="text-muted text-small tabular-nums">
                  {job.year}
                </span>
                <p className="text-small leading-snug">
                  <span className="font-semibold">{job.name}</span>
                  <span className="text-muted">, {job.role}</span>
                </p>
              </li>
            ))}
          </ol>
          <a
            href={person.social.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline mt-4 inline-flex items-center gap-1.5 font-semibold text-small"
          >
            <Icon icon={GithubIcon} size={16} />
            Ver código en GitHub
          </a>
        </Section>

        <Section title="Escaneá">
          <div
            id="qr-panel"
            role="tabpanel"
            aria-label={current.label}
            className="relative grid aspect-square place-items-center overflow-clip bg-snow p-7 mx-auto max-w-[24rem]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.id}
                role="img"
                aria-label={`Código QR: ${current.caption}`}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.97, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.97, filter: "blur(4px)" }
                }
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="size-full [&_svg]:size-full"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated on the server by the qrcode library.
                dangerouslySetInnerHTML={{ __html: current.svg ?? "" }}
              />
            </AnimatePresence>
          </div>

          <div
            role="tablist"
            aria-label="Qué abre el código"
            onKeyDown={onKey}
            className="relative mt-2 grid grid-cols-3 bg-surface p-1 mx-auto max-w-[24rem]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] bg-ink transition-transform duration-250 ease-(--ease-out)"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
            {targets.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="qr-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`press relative z-10 min-h-11 font-semibold text-small transition-colors duration-200 ${
                  i === active ? "text-paper" : "text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p
            className="mt-3 text-center text-muted text-small mx-auto max-w-[24rem]"
            aria-live="polite"
          >
            {current.caption}
          </p>
        </Section>

        <Section title="Links">
          <ul className="divide-y divide-ink/10 border-ink/10 border-y">
            {links.map((l) => {
              const external = l.href.startsWith("http");
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="press flex min-h-13 items-center gap-3 py-2"
                  >
                    <Icon icon={l.icon} size={20} />
                    <span className="font-semibold text-small">{l.label}</span>
                    <span className="ml-auto truncate text-muted text-small">
                      {l.value}
                    </span>
                    <Icon
                      icon={ArrowUpRight01Icon}
                      size={16}
                      className="shrink-0 opacity-50"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Room for the action bar. */}
        <div className="relative h-40 overflow-clip bg-accent lg:h-28">
          <HalftoneField
            seed={3.1}
            fade="up"
            className="absolute inset-0 text-accent-deep"
          />
        </div>

        {/* Action bar: what people do with a business card. It leaves the right
            corner to the Tools button, which sits in the same row. */}
        <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-[4.75rem] z-30 md:right-[5.25rem] lg:hidden">
          <div className="grid grid-cols-[1fr_auto] gap-2 bg-ink p-1.5 shadow-[0_18px_50px_-12px_rgb(18_13_38/0.5)]">
            <button
              type="button"
              onClick={saveContact}
              className="btn [--btn-bg-hover:var(--color-accent-deep)]"
            >
              <Icon icon={UserAdd01Icon} size={18} />
              Guardar contacto
            </button>
            <button
              type="button"
              onClick={share}
              aria-label={shared ? "Link copiado" : "Compartir"}
              className="btn aspect-square px-0 [--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)] [--btn-bg-hover:var(--color-lilac)] [--btn-fg-hover:var(--color-ink)]"
            >
              <Icon
                icon={shared ? CheckmarkCircle02Icon : Share08Icon}
                size={18}
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
