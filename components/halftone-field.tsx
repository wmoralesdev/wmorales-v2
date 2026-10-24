"use client";

import { useEffect, useRef } from "react";

type Style = "fluid" | "waves";

/**
 * A generative halftone: dots sized by a slowly moving field, like ink drifting in
 * water. Used as a supporting texture next to the photos. The style (fluid, waves
 * or off) and dot pitch come from the Tools prefs on <html>; the dots take the
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

    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let style: Style | "off" = "fluid";
    let cell = 6;
    let w = 0;
    let h = 0;
    let color = "";
    let visible = false;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();

    function readPrefs() {
      style = (html.dataset.ht as Style | "off" | undefined) ?? "fluid";
      cell =
        Number.parseFloat(
          getComputedStyle(html).getPropertyValue("--ht-cell"),
        ) || 6;
      color = getComputedStyle(wrap as HTMLElement).color;
      wrap?.toggleAttribute("hidden", style === "off");
    }

    function resize() {
      if (!canvas || !ctx || !wrap) return;
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Both fields return 0..1. Coordinates are in units of the shorter side so the
    // shapes keep their proportions on wide and tall boxes.
    function fluid(x: number, y: number, t: number) {
      const wx = x + 0.18 * Math.sin(2.6 * y + t * 0.5 + seed);
      const wy = y + 0.18 * Math.sin(2.2 * x - t * 0.42 + seed * 1.7);
      const cx = 0.7 + 0.35 * Math.sin(t * 0.21 + seed);
      const cy = 0.5 + 0.3 * Math.cos(t * 0.17 + seed);
      const v =
        Math.sin(3.4 * wx + t * 0.6) +
        Math.sin(4.1 * wy - t * 0.45) +
        Math.sin(2.7 * (wx + wy) + t * 0.33) +
        Math.sin(5 * Math.hypot(wx - cx, wy - cy) - t * 0.8);
      const n = (v / 4 + 1) / 2;
      // Push toward 0 and 1 so the field reads as blobs, not fog.
      const k = Math.min(Math.max((n - 0.38) / 0.4, 0), 1);
      return k * k * (3 - 2 * k);
    }

    function waves(x: number, y: number, t: number) {
      const v = Math.sin(
        7 * y + 1.6 * Math.sin(2.4 * x + t * 0.5 + seed) - t * 0.7,
      );
      return ((v + 1) / 2) ** 2;
    }

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (style === "off" || !w || !h) return;
      const t = reduced.matches ? 4 : (now - t0) / 1000;
      const field = style === "waves" ? waves : fluid;
      const unit = Math.min(w, h);
      const max = cell * 0.48;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let row = 0, y = cell / 2; y < h + cell; row++, y += cell) {
        const shift = row % 2 ? cell / 2 : 0;
        const edge = fade === "down" ? 1 - y / h : fade === "up" ? y / h : 1;
        for (let x = shift; x < w + cell; x += cell) {
          const r = field(x / unit, y / unit, t) * max * edge;
          if (r < 0.3) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }

    function frame(now: number) {
      raf = 0;
      if (!visible || reduced.matches || style === "off") return;
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

    readPrefs();
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

    // The Tools panel flips data attributes on <html>; follow along live.
    const mo = new MutationObserver(() => {
      readPrefs();
      start();
    });
    mo.observe(html, { attributes: true });

    const onMotion = () => start();
    reduced.addEventListener("change", onMotion);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
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
