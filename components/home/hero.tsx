"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { useRef } from "react";
import { printName, weightWave } from "@/components/name-motion";
import { SiteHeader } from "@/components/site-header";
import { PortraitCanvas } from "./portrait-canvas";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const LINES = ["Walter", "Morales"];

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
      className="hero-name display absolute left-4 top-[calc(100%-var(--rest)-1.38em)] text-[12vw] leading-[0.92] sm:left-7 md:text-[min(9.5vw,19svh)]"
    >
      {LINES.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}

/**
 * The portrait is printed twice, once per ink, and each copy is clipped to its side
 * of the seam. It always prints in the light palette, its dots shrink away toward
 * the edges, and the copy above the water keeps a soft sheet of paper behind it, so
 * the face reads the same in the dark theme without a hard rectangle.
 */
function Portrait({ below }: { below?: boolean }) {
  return (
    <div className="theme-light absolute top-[30%] right-0 w-[64vw] sm:right-7 md:top-auto md:bottom-0 md:w-[min(42vw,62svh)]">
      {!below && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-paper [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_10%,#000_32%,#000_68%,transparent_90%),linear-gradient(to_bottom,transparent_8%,#000_28%)]"
        />
      )}
      <PortraitCanvas
        light={below}
        decorative={below}
        fadeEdges
        className={`relative ${below ? "text-snow" : "text-accent"}`}
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
 * Waterline hero: two flat fields meet at the seam, and the name and the halftone
 * portrait change ink where they cross it. Scrolling raises the water until both
 * are submerged. On top of that, three ambient motions run on their own: the name
 * prints in as halftone, the tide moves the seam, and a weight wave rolls through.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const aboveRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !aboveRef.current || !belowRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-title"
      data-portrait-pointer
      className="relative h-svh min-h-[36rem] overflow-clip bg-paper [--seam:calc(100%-var(--water))] [--rest:44%] [--water:var(--rest)] md:[--rest:46%]"
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
        <Portrait />
        <Headline as="h1" id="hero-title" />
      </div>

      {/* Below the water: night ink on the accent field, in either theme. */}
      <div
        ref={belowRef}
        className="absolute inset-0 bg-accent text-night [clip-path:inset(var(--seam)_0_0_0)]"
      >
        <Portrait below />
        <Headline as="p" hidden />
      </div>

      <div className="absolute inset-x-0 top-0">
        <SiteHeader />
      </div>

      <div className="fade-in-late absolute inset-x-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-snow sm:left-7 md:right-auto md:bottom-10 md:max-w-[min(44vw,30rem)]">
        <div className="flex flex-col items-start gap-5">
          <p className="text-[1.0625rem] leading-snug sm:text-lead">
            AI Engineer y Co-Founder de Ai Labs. Llevo la inteligencia
            artificial a producción en empresas de Latinoamérica.
          </p>
          <Link
            href="/book"
            className="btn [--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)]"
          >
            Agendar llamada
          </Link>
        </div>
      </div>
    </section>
  );
}
