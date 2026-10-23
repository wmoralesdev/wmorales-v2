"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentPropsWithoutRef, type ElementType, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/**
 * Choreographs the entrance of a section's parts, once, as it enters:
 *  - [data-reveal]        rise 24px + fade, staggered in reading order
 *  - [data-reveal="clip"] picture opens from the bottom like a shutter
 *  - [data-count]         figure counts up to its value
 * Content is server-rendered and visible without JS; reduced motion skips travel.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  ...props
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rise = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]:not([data-reveal='clip'])",
          el,
        );
        if (rise.length) {
          gsap.from(rise, {
            y: 24,
            opacity: 0,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.075,
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          });
        }

        for (const pic of gsap.utils.toArray<HTMLElement>(
          "[data-reveal='clip']",
          el,
        )) {
          gsap.fromTo(
            pic,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.25,
              ease: "power4.inOut",
              scrollTrigger: { trigger: pic, start: "top 88%", once: true },
            },
          );
        }

        for (const fig of gsap.utils.toArray<HTMLElement>("[data-count]", el)) {
          const target = Number(fig.dataset.count);
          const counter = { v: 0 };
          if (fig.getBoundingClientRect().top > window.innerHeight)
            fig.textContent = "0";
          gsap.to(counter, {
            v: target,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: fig, start: "top 90%", once: true },
            onUpdate: () => {
              fig.textContent = Math.round(counter.v).toString();
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Tag ref={root} {...props}>
      {children}
    </Tag>
  );
}
