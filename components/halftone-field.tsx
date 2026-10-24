"use client";

import { useEffect, useRef } from "react";
import { onThemeChange } from "@/lib/theme";

const CELL = 6;

/**
 * A generative halftone: dots sized by slow, bending waves, like ink moving on
 * water. Used as a supporting texture next to the photos; the dots take the
 * element's text colour.
 *
 * It only animates while on screen, at ~30fps, and draws one still frame under
 * reduced motion.
 */
export function HalftoneField({
  className = "",
  seed = 0,
  fade = "none",
}: {
  className?: string;
  /** Offsets the field so neighbouring instances don't move in lockstep. */
  seed?: number;
  /** Lets the dots thin out toward one edge. */
  fade?: "none" | "up" | "down";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let color = "";
    let visible = false;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();

    function resize() {
      if (!canvas || !ctx || !wrap) return;
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Returns 0..1. Coordinates are in units of the shorter side so the waves keep
    // their proportions on wide and tall boxes.
    function waves(x: number, y: number, t: number) {
      const v = Math.sin(
        7 * y + 1.6 * Math.sin(2.4 * x + t * 0.5 + seed) - t * 0.7,
      );
      return ((v + 1) / 2) ** 2;
    }

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;
      const t = reduced.matches ? 4 : (now - t0) / 1000;
      const unit = Math.min(w, h);
      const max = CELL * 0.48;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let row = 0, y = CELL / 2; y < h + CELL; row++, y += CELL) {
        const shift = row % 2 ? CELL / 2 : 0;
        const edge = fade === "down" ? 1 - y / h : fade === "up" ? y / h : 1;
        for (let x = shift; x < w + CELL; x += CELL) {
          const r = waves(x / unit, y / unit, t) * max * edge;
          if (r < 0.3) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }

    function frame(now: number) {
      raf = 0;
      if (!visible || reduced.matches) return;
      if (now - last >= 33) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      draw(performance.now());
      if (!raf && visible && !reduced.matches)
        raf = requestAnimationFrame(frame);
    }

    color = getComputedStyle(wrap).color;
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(wrap);

    const offTheme = onThemeChange(() => {
      color = getComputedStyle(wrap).color;
      draw(performance.now());
    });

    const onMotion = () => start();
    reduced.addEventListener("change", onMotion);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      offTheme();
      reduced.removeEventListener("change", onMotion);
    };
  }, [seed, fade]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
