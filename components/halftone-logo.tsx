"use client";

import { useEffect, useRef } from "react";
import { LOGO_GRID, type LogoName, logoDots } from "@/lib/logo-dots";

const MAX_R = 0.46;

/** Dot radius (in grid cells) for the share of its cell the logo covers. */
function radius(coverage: number) {
  return coverage < 0.08 ? 0 : MAX_R * Math.sqrt(coverage);
}

/**
 * A brand logo printed as halftone, in the same dot style as the halftone
 * icons. Grids are traced from /public/logos by scripts/logo-dots.mjs
 * (`pnpm halftone:logos`), which also evens out size and weight between marks.
 * Render it at size-16 or larger so the dots stay chunky.
 *
 * While the pointer is over the closest `[data-icon-hover]` ancestor, a pulse
 * runs out from the centre: the dots swell and settle in place, so the mark
 * never loses its shape. Never animates under reduced motion. Dots take the
 * text colour.
 *
 * Decorative: always render the brand's name in text next to it.
 */
export function HalftoneLogo({
  name,
  className = "",
}: {
  name: LogoName;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dots = logoDots[name]
    .map((c, i) => ({
      cx: (i % LOGO_GRID) + 0.5,
      cy: Math.floor(i / LOGO_GRID) + 0.5,
      r: radius(c / 99),
    }))
    .filter((d) => d.r > 0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: dots derive from name.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const circles = Array.from(svg.querySelectorAll("circle"));
    const trigger =
      (svg.closest("[data-icon-hover]") as HTMLElement | null) ?? svg;
    const mid = LOGO_GRID / 2;
    let raf = 0;
    let hovering = false;
    let amp = 0;
    const t0 = performance.now();

    function frame(now: number) {
      raf = 0;
      amp += ((hovering ? 1 : 0) - amp) * 0.12;
      const t = (now - t0) / 1000;
      for (let i = 0; i < circles.length; i++) {
        const d = dots[i];
        const dist = Math.hypot(d.cx - mid, d.cy - mid) / mid;
        // A ring of swelling that travels outward; dots never shrink below rest.
        const pulse =
          1 + amp * 0.35 * Math.max(0, Math.sin(t * 6 - dist * 6)) ** 2;
        circles[i].setAttribute("r", (d.r * pulse).toFixed(3));
      }
      if (hovering || amp > 0.01) {
        raf = requestAnimationFrame(frame);
      } else {
        for (let i = 0; i < circles.length; i++) {
          circles[i].setAttribute("r", dots[i].r.toFixed(3));
        }
      }
    }

    const enter = () => {
      hovering = true;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const leave = () => {
      hovering = false;
    };
    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    trigger.addEventListener("focusin", enter);
    trigger.addEventListener("focusout", leave);

    return () => {
      cancelAnimationFrame(raf);
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focusin", enter);
      trigger.removeEventListener("focusout", leave);
    };
  }, [name]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${LOGO_GRID} ${LOGO_GRID}`}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {dots.map((d) => (
        <circle
          key={`${d.cx}-${d.cy}`}
          cx={d.cx}
          cy={d.cy}
          r={d.r.toFixed(3)}
        />
      ))}
    </svg>
  );
}
