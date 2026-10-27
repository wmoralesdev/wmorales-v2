"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { motion, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import type { PointerEvent } from "react";
import { HalftoneField } from "@/components/halftone-field";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The whole tile is the button, the closing partner of the lit tile on the services wall. The arrow leans toward the pointer on a spring. */
export function CtaBand({ t, href }: { t: Dictionary["cta"]; href: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 });

  function onMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 36);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 36);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section id="contacto" aria-labelledby="contacto-title">
      <Link
        href={href}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative flex min-h-[18rem] flex-col gap-16 justify-between overflow-clip bg-accent px-5 pt-6 pb-6 text-snow outline-offset-[-6px] transition-colors duration-500 ease-(--ease-out) motion-reduce:transition-none focus-visible:bg-night sm:px-7 md:min-h-[24rem] md:hover:bg-night"
      >
        <HalftoneField
          seed={2.4}
          fade="up"
          className="absolute inset-0 text-accent-deep transition-opacity duration-500 ease-(--ease-out) group-hover:opacity-40"
        />
        <div className="relative flex items-start justify-between gap-6">
          <p className="max-w-[22rem] text-[1.0625rem] leading-snug md:text-[1.25rem]">
            {t.lead}
          </p>
          <motion.span style={{ x, y }} className="shrink-0">
            <Icon
              icon={ArrowUpRight01Icon}
              size={48}
              strokeWidth={1.6}
              className="size-8 md:size-12"
            />
          </motion.span>
        </div>
        <h2
          id="contacto-title"
          className="display relative -mb-[0.08em] text-[16vw] leading-[0.85] text-snow md:text-[clamp(5rem,10vw,9rem)]"
        >
          {t.title}
        </h2>
      </Link>
    </section>
  );
}
