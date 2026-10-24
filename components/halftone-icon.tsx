"use client";

import { useEffect, useMemo, useRef } from "react";
import { type ShapeName, shapes } from "@/lib/halftone-shapes";

type Motion = "none" | "hover" | "morph";

const HOLD_MS = 1800;
const MORPH_MS = 750;
const MAX_R = 0.5;

/**
 * Dot radius (in grid cells) for a signed distance, measured in grid steps so the
 * look holds at any density. Dots grow with depth: full size a step and a half in,
 * about half size on the edge, and they die out half a step outside.
 */
function radius(d: number, step: number) {
  const depth = -d / step;
  const v = clamp01((depth + 0.8) / 2.3) ** 0.8;
  return v < 0.14 ? 0 : MAX_R * (0.25 + 0.75 * v);
}

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * An icon printed as halftone: a shape sampled on a coarse dot grid.
 *
 * - motion="hover": the dots ripple while the pointer is over the nearest
 *   `[data-icon-hover]` ancestor (or the icon itself).
 * - motion="morph": cycles through `shape` when it is an array, melting from one
 *   shape into the next.
 *
 * Renders static dots on the server; animation only runs on screen and never
 * under reduced motion. Dots take the text colour.
 */
export function HalftoneIcon({
  shape,
  grid = 9,
  motion = "none",
  label,
  className = "",
}: {
  shape: ShapeName | ShapeName[];
  grid?: number;
  motion?: Motion;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
  className?: string;
}) {
  const list = Array.isArray(shape) ? shape : [shape];
  const key = list.join(",");
  const svgRef = useRef<SVGSVGElement>(null);

  const points = useMemo(() => {
    const out: { cx: number; cy: number; x: number; y: number }[] = [];
    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        out.push({
          cx: col + 0.5,
          cy: row + 0.5,
          x: ((col + 0.5) / grid) * 2 - 1,
          y: ((row + 0.5) / grid) * 2 - 1,
        });
      }
    }
    return out;
  }, [grid]);

  const first = shapes[list[0]];
  const step = 2 / grid;
  const initial = points.map((p) => radius(first(p.x, p.y), step));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || motion === "none") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const names = key.split(",") as ShapeName[];
    const dots = Array.from(svg.querySelectorAll("circle"));
    const trigger =
      (svg.closest("[data-icon-hover]") as HTMLElement | null) ?? svg;
    let raf = 0;
    let visible = false;
    let hovering = false;
    let amp = 0;
    const t0 = performance.now();

    function render(now: number) {
      const t = (now - t0) / 1000;
      let sdf = (x: number, y: number) => shapes[names[0]](x, y);

      if (motion === "morph" && names.length > 1) {
        const step = HOLD_MS + MORPH_MS;
        const i = Math.floor((now - t0) / step);
        const into = (now - t0) % step;
        const a = shapes[names[i % names.length]];
        const b = shapes[names[(i + 1) % names.length]];
        const m = ease(clamp01((into - HOLD_MS) / MORPH_MS));
        sdf = (x, y) => a(x, y) * (1 - m) + b(x, y) * m;
      }

      for (let i = 0; i < dots.length; i++) {
        const p = points[i];
        // A ring of swelling that travels outward from the centre.
        const wave = amp * 0.35 * Math.sin(t * 5 - Math.hypot(p.x, p.y) * 5);
        dots[i].setAttribute(
          "r",
          radius(sdf(p.x, p.y) - wave * step * 4, step).toFixed(3),
        );
      }
    }

    function frame(now: number) {
      raf = 0;
      amp += ((hovering ? 1 : 0) - amp) * 0.12;
      render(now);
      const idle = motion === "hover" && !hovering && amp < 0.01;
      if (idle) {
        amp = 0;
        render(now);
        return;
      }
      if (visible) raf = requestAnimationFrame(frame);
    }

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && motion === "morph") wake();
    });
    io.observe(svg);

    const enter = () => {
      hovering = true;
      wake();
    };
    const leave = () => {
      hovering = false;
      wake();
    };
    if (motion === "hover") {
      trigger.addEventListener("pointerenter", enter);
      trigger.addEventListener("pointerleave", leave);
      trigger.addEventListener("focusin", enter);
      trigger.addEventListener("focusout", leave);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focusin", enter);
      trigger.removeEventListener("focusout", leave);
    };
  }, [key, motion, points, step]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${grid} ${grid}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      fill="currentColor"
    >
      {points.map((p, i) => (
        <circle
          key={`${p.cx}-${p.cy}`}
          cx={p.cx}
          cy={p.cy}
          r={initial[i].toFixed(3)}
        />
      ))}
    </svg>
  );
}
