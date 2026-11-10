"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { Cover } from "@/components/cover";
import { printName, weightWave } from "@/components/name-motion";
import { SiteHeader } from "@/components/site-header";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { PortraitCanvas } from "./portrait-canvas";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const LINES = ["Walter", "Morales"];

// The waterline only exists from md, and only moves when motion is welcome.
const WATERLINE =
  "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

function Headline({
  as: Tag,
  hidden,
  id,
}: {
  as: "h1" | "p";
  hidden?: boolean;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      aria-hidden={hidden || undefined}
      className="hero-name display absolute top-[calc(100%-var(--rest)-1.38em)] left-7 text-[min(8.25vw,17svh)] leading-[0.92]"
    >
      {/* The space keeps the name two words for anything that reads the text
          without the layout (crawlers, link previews, copy and paste). */}
      {LINES.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && " "}
          <span className="block">{line}</span>
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * The portrait is printed twice, once per ink, and each copy is clipped to its side
 * of the seam. It always prints in the light palette, and the copy above the water
 * keeps its own paper behind it, so the face reads the same in the dark theme.
 */
function Portrait({ below, label }: { below?: boolean; label: string }) {
  return (
    <div
      className={`theme-light absolute right-7 bottom-0 w-[min(40vw,60svh)] [&_canvas]:block ${below ? "" : "bg-paper"}`}
    >
      <PortraitCanvas
        label={label}
        light={below}
        decorative={below}
        className={below ? "text-snow" : "text-accent"}
      />
    </div>
  );
}

/** Splits both copies of the name (above and below the water) into matching letter pairs. */
function splitName(root: HTMLElement) {
  const [above, below] = gsap.utils.toArray<HTMLElement>(".hero-name", root);
  const a = SplitText.create(Array.from(above.children), {
    type: "chars",
    charsClass: "ht-char",
  });
  const b = SplitText.create(Array.from(below.children), {
    type: "chars",
    charsClass: "ht-char",
  });
  above.dataset.split = "";
  below.dataset.split = "";
  return {
    pairs: a.chars.map((c, i) => [c, b.chars[i]] as HTMLElement[]),
    undo: () => {
      a.revert();
      b.revert();
      delete above.dataset.split;
      delete below.dataset.split;
    },
  };
}

/**
 * The tide: the seam stops being a ruler-straight line and swells like water,
 * so the name and portrait keep changing ink without anyone touching anything.
 * Draws clip-path polygons for both layers; follows the scroll-driven --water.
 */
function tide(
  root: HTMLElement,
  above: HTMLElement,
  below: HTMLElement,
): () => void {
  const points = 28;
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  io.observe(root);

  const tick = (time: number) => {
    if (!visible) return;
    const w = root.clientWidth;
    const h = root.clientHeight;
    const water = Number.parseFloat(
      getComputedStyle(root).getPropertyValue("--water"),
    );
    const seam = h * (1 - (Number.isNaN(water) ? 46 : water) / 100);
    const amp = Math.min(16, h * 0.02);
    const ys: string[] = [];
    for (let i = 0; i <= points; i++) {
      const u = i / points;
      const y =
        seam +
        amp * Math.sin(u * Math.PI * 2.4 + time * 0.9) +
        amp * 0.45 * Math.sin(u * Math.PI * 5.2 - time * 1.4) +
        amp * 0.7 * Math.sin(time * 0.45);
      ys.push(`${(u * w).toFixed(1)}px ${y.toFixed(1)}px`);
    }
    above.style.clipPath = `polygon(0 0, ${w}px 0, ${[...ys].reverse().join(", ")})`;
    below.style.clipPath = `polygon(${ys.join(", ")}, ${w}px ${h}px, 0 ${h}px)`;
  };

  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    io.disconnect();
    above.style.clipPath = "";
    below.style.clipPath = "";
  };
}

/**
 * The first screen, in two builds.
 *
 * From md, the waterline: two flat fields meet at the seam, and the name and the
 * halftone portrait change ink where they cross it. Scrolling raises the water
 * until both are submerged. On top of that, three ambient motions run on their
 * own: the name prints in as halftone, the tide moves the seam, and a weight wave
 * rolls through.
 *
 * On phones, the cover from the intro card: the portrait and the name on the accent
 * field, then the tagline and the booking button on paper, in thumb reach. The two
 * never run together; the waterline's motion only starts from md.
 */
export function Hero({
  t,
  book,
  home,
}: {
  t: Dictionary["hero"];
  book: { href: string; label: string };
  home: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const aboveRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !aboveRef.current || !belowRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(WATERLINE, () => {
        gsap.to(el, {
          "--water": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom 15%",
            scrub: true,
          },
        });

        const split = splitName(el);
        printName(split.pairs);
        weightWave(split.pairs);
        const stopTide = tide(
          el,
          aboveRef.current as HTMLElement,
          belowRef.current as HTMLElement,
        );

        return () => {
          stopTide();
          split.undo();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="inicio" aria-label="Walter Morales" className="bg-paper">
      {/* Phones: the cover takes the screen less the room the words under it
          need, so the button ends the first screen. */}
      <div className="md:hidden">
        <Cover
          nameId="hero-title-phone"
          portraitLabel={t.portrait}
          className="[--cover:max(18rem,calc(100svh-12.5rem))]"
        >
          <SiteHeader tone="accent" home={home} action={book} />
        </Cover>
        {/* The button stops short of the corner, where the Tools button sits. */}
        <div className="fade-in-late px-4 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
          <p className="text-lead leading-snug">{t.tagline}</p>
          <Link
            href={book.href}
            className="btn mt-5 mr-[3.75rem] flex min-h-12"
          >
            {book.label}
          </Link>
        </div>
      </div>

      {/* From md: the waterline. */}
      <div
        ref={root}
        data-portrait-pointer
        className="relative hidden h-svh min-h-[36rem] overflow-clip bg-paper [--rest:46%] [--seam:calc(100%-var(--water))] [--water:var(--rest)] md:block"
      >
        {/* Above the water: accent ink on paper. */}
        <div
          ref={aboveRef}
          className="absolute inset-0 text-accent [clip-path:inset(0_0_var(--water)_0)]"
        >
          {/* Halftone seam: rows of growing dots, like ink bleeding on newsprint. */}
          <div
            aria-hidden="true"
            className="seam-strip absolute inset-x-0 top-[var(--seam)] -translate-y-full"
          >
            <div className="dot-screen h-1 [--dot-r:12%] [--dot-size:4px]" />
            <div className="dot-screen h-1 [--dot-r:20%] [--dot-size:4px]" />
            <div className="dot-screen h-1 [--dot-r:28%] [--dot-size:4px]" />
            <div className="dot-screen h-1 [--dot-r:36%] [--dot-size:4px]" />
          </div>
          <Portrait label={t.portrait} />
          <Headline as="h1" id="hero-title" />
        </div>

        {/* Below the water: night ink on the accent field, in either theme. */}
        <div
          ref={belowRef}
          className="absolute inset-0 bg-accent text-night [clip-path:inset(var(--seam)_0_0_0)]"
        >
          <Portrait below label={t.portrait} />
          <Headline as="p" hidden />
        </div>

        <div className="absolute inset-x-0 top-0">
          <SiteHeader home={home} action={book} />
        </div>

        <div className="fade-in-late absolute bottom-10 left-7 max-w-[min(44vw,30rem)] text-snow">
          <div className="flex flex-col items-start gap-5">
            <p className="text-lead leading-snug">{t.tagline}</p>
            <Link
              href={book.href}
              className="btn [--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)]"
            >
              {book.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
