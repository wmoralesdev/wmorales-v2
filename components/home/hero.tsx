"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SiteHeader } from "@/components/site-header";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = ["Walter Morales", "Consultor de IA"];

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
      className="display absolute inset-x-4 top-[calc(100%-var(--rest)-1.38em)] text-center text-[13.2vw] leading-[0.92] sm:inset-x-7 md:text-[min(10.8vw,21svh)]"
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

/**
 * Waterline hero: two flat fields meet at the seam and the headline changes ink
 * where it crosses. Scrolling raises the water until the whole name is submerged.
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
      className="relative h-svh min-h-[34rem] overflow-clip bg-paper [--seam:calc(100%-var(--water))] [--rest:46%] [--water:var(--rest)] md:[--rest:50%]"
    >
      {/* Above the water: accent ink on paper. */}
      <div className="absolute inset-0 text-accent [clip-path:inset(0_0_var(--water)_0)]">
        {/* Halftone seam: three rows of growing dots, like ink bleeding on newsprint. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[var(--seam)] -translate-y-full"
        >
          <div className="dot-screen h-2 [--dot-r:14%] [--dot-size:8px]" />
          <div className="dot-screen h-2 [--dot-r:24%] [--dot-size:8px]" />
          <div className="dot-screen h-2 [--dot-r:36%] [--dot-size:8px]" />
        </div>
        <Headline as="h1" id="hero-title" />
      </div>

      {/* Below the water: deep ink on the accent field. */}
      <div className="absolute inset-0 bg-accent text-ink [clip-path:inset(var(--seam)_0_0_0)]">
        <Headline as="p" hidden />
      </div>

      <div className="absolute inset-x-0 top-0">
        <SiteHeader />
      </div>

      <div className="fade-in-late absolute inset-x-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-paper sm:inset-x-7 md:bottom-10">
        <p className="max-w-[34rem] text-[1.0625rem] leading-snug sm:text-lead md:mx-auto md:max-w-[44rem] md:text-center">
          Ayudo a empresas de Latinoamérica a llevar la inteligencia artificial
          a producción: estrategia, agentes y equipos que construyen con Cursor.
          Fundador de Ai Labs.
        </p>
      </div>
    </section>
  );
}
