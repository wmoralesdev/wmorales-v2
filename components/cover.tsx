"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";
import { HalftoneField } from "@/components/halftone-field";
import { PortraitCanvas } from "@/components/home/portrait-canvas";
import { printName, weightWave } from "@/components/name-motion";

gsap.registerPlugin(SplitText, useGSAP);

/**
 * The cover: Walter's portrait printed in snow ink on the accent field, his name
 * across the foot. It opens the intro card and, on phones, the home page.
 *
 * The caller sets the height as `--cover` (in `className`); the portrait and the
 * name size themselves from that height and from the cover's own width, so the
 * same cover works short on a phone and a full screen tall on desktop. `children`
 * is the row across the top. The name isn't selectable, so dragging across the
 * portrait doesn't highlight it.
 */
export function Cover({
  as: Tag = "div",
  nameId,
  portraitLabel,
  className = "",
  children,
}: {
  as?: "div" | "header";
  nameId: string;
  portraitLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Same name motion as the desktop hero: it prints in as halftone, then a ripple
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

  return (
    <Tag
      data-portrait-pointer
      className={`relative overflow-clip bg-accent text-snow h-(--cover) select-none [container-type:inline-size] ${className}`}
    >
      <HalftoneField
        seed={1.3}
        fade="down"
        className="absolute inset-0 text-accent-deep"
      />
      {children}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.9, bounce: 0.1 }}
        className="theme-light absolute right-0 bottom-0 w-[min(88cqw,calc(var(--cover)*0.74))] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_40%),linear-gradient(to_bottom,transparent,#000_25%)]"
      >
        <PortraitCanvas light label={portraitLabel} className="text-snow" />
      </motion.div>
      <h1
        ref={nameRef}
        id={nameId}
        className="hero-name display absolute bottom-[4cqw] left-4 text-[length:min(15cqw,calc(var(--cover)*0.24),8rem)] leading-[0.88] sm:left-7 lg:left-10"
      >
        Walter <br />
        Morales
      </h1>
    </Tag>
  );
}
