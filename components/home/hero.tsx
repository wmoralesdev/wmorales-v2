"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { PortraitCanvas } from "./portrait-canvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
      className="display absolute left-4 top-[calc(100%-var(--rest)-1.38em)] text-[min(calc(12vw*var(--display-fit)*var(--display-scale)),12.5vw)] leading-[0.92] sm:left-7 md:text-[min(calc(9.5vw*var(--display-fit)*var(--display-scale)),19svh)]"
    >
      {LINES.map((line, i) => (
        <span
          key={line}
          className="mask-line"
          style={{ "--i": i } as React.CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** The portrait is printed twice, once per ink, and each copy is clipped to its side of the seam. */
function Portrait({ below }: { below?: boolean }) {
  return (
    <div className="absolute top-[30%] right-0 w-[64vw] sm:right-7 md:top-auto md:bottom-0 md:w-[min(42vw,62svh)]">
      <PortraitCanvas
        light={below}
        decorative={below}
        className={below ? "text-paper" : "text-accent"}
      />
    </div>
  );
}

/**
 * Waterline hero: two flat fields meet at the seam, and the name and the halftone
 * portrait change ink where they cross it. Scrolling raises the water until both
 * are submerged.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(root.current, {
          "--water": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 15%",
            scrub: true,
          },
        });
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
      <div className="absolute inset-0 text-accent [clip-path:inset(0_0_var(--water)_0)]">
        {/* Halftone seam: three rows of growing dots, like ink bleeding on newsprint. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[var(--seam)] -translate-y-full"
        >
          <div className="dot-screen h-1 [--dot-r:12%] [--dot-size:4px]" />
          <div className="dot-screen h-1 [--dot-r:20%] [--dot-size:4px]" />
          <div className="dot-screen h-1 [--dot-r:28%] [--dot-size:4px]" />
          <div className="dot-screen h-1 [--dot-r:36%] [--dot-size:4px]" />
        </div>
        <Portrait />
        <Headline as="h1" id="hero-title" />
      </div>

      {/* Below the water: deep ink on the accent field. */}
      <div className="absolute inset-0 bg-accent text-ink [clip-path:inset(var(--seam)_0_0_0)]">
        <Portrait below />
        <Headline as="p" hidden />
      </div>

      <div className="absolute inset-x-0 top-0">
        <SiteHeader />
      </div>

      <div className="fade-in-late absolute inset-x-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-paper sm:left-7 md:right-auto md:bottom-10 md:max-w-[min(44vw,30rem)]">
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
