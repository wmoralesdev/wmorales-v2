"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { motion, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import type { PointerEvent } from "react";
import { Icon } from "@/components/icon";

/** The whole band is the button. The arrow leans toward the pointer on a spring. */
export function CtaBand() {
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
        href="/book"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative flex h-[46svh] min-h-[18rem] flex-col justify-between overflow-clip bg-accent px-4 pt-5 pb-6 text-paper outline-offset-[-6px] focus-visible:bg-ink sm:px-7 md:h-[62svh] md:hover:bg-ink"
      >
        <div className="flex items-start justify-between gap-6">
          <p className="max-w-[22rem] text-[1.0625rem] leading-snug md:text-[1.25rem]">
            Agendá una llamada. Salís con un diagnóstico inicial y próximos
            pasos claros para tu equipo.
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
          className="display -mb-[0.06em] text-[22vw] leading-[0.8] text-paper md:text-[23.2vw]"
        >
          Hablemos
        </h2>
      </Link>
    </section>
  );
}
