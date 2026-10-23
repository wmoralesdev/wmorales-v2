"use client";

import { useEffect, useRef } from "react";
import { portraitDots } from "@/lib/portrait-dots";

type Ripple = { x: number; y: number; t0: number };

const RIPPLE_MS = 1400;

/**
 * Walter's portrait as a live halftone screen. The dots swell under the pointer and
 * a tap sends a ripple through the print. Static (and cheap) when nobody touches it.
 */
export function PortraitCanvas({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, data } = portraitDots;
    const count = cols * rows;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cell = 0;
    let base = new Float32Array(count);
    let cur = new Float32Array(count);
    let pointer: { x: number; y: number } | null = null;
    let ripples: Ripple[] = [];
    let raf = 0;
    let color = "#120d26";

    const dotX = (i: number) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      return x * cell + cell / 2 + (y % 2 ? cell / 2 : 0);
    };
    const dotY = (i: number) => Math.floor(i / cols) * cell + cell / 2;

    function resize() {
      if (!canvas || !ctx) return;
      const w = canvas.parentElement?.clientWidth ?? 320;
      cell = w / (cols + 0.5);
      const h = rows * cell;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(canvas).color;
      base = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const lum = data[i] / 99;
        // Light ink on a dark field prints the highlights; dark ink prints the shadows.
        base[i] = (light ? lum ** 0.85 : (1 - lum) ** 1.15) * cell * 0.62;
      }
      cur = base.slice();
      draw();
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const r = cur[i];
        if (r < 0.35) continue;
        const x = dotX(i);
        const y = dotY(i);
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    function frame(now: number) {
      ripples = ripples.filter((r) => now - r.t0 < RIPPLE_MS);
      const lens = cell * 9;
      const band = cell * 3.5;
      const max = cell * 0.72;
      let moving = false;

      for (let i = 0; i < count; i++) {
        let target = base[i];
        const x = dotX(i);
        const y = dotY(i);
        if (pointer) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          if (d < lens) target += (1 - d / lens) ** 2 * cell * 0.38;
        }
        for (const rp of ripples) {
          const age = (now - rp.t0) / RIPPLE_MS;
          const radius = age * cell * 70;
          const d = Math.hypot(x - rp.x, y - rp.y);
          const k = Math.exp(-(((d - radius) / band) ** 2)) * (1 - age);
          target += k * cell * 0.45;
        }
        target = Math.min(target, max);
        const next = cur[i] + (target - cur[i]) * 0.18;
        if (Math.abs(next - cur[i]) > 0.01) moving = true;
        cur[i] = next;
      }

      draw();
      raf =
        moving || ripples.length || pointer ? requestAnimationFrame(frame) : 0;
    }

    const wake = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = local(e);
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ ...local(e), t0: performance.now() });
      wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    // Greet the visitor once, when the portrait first scrolls into view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        ripples.push({
          x: canvas.clientWidth * 0.5,
          y: canvas.clientHeight * 0.3,
          t0: performance.now(),
        });
        wake();
      },
      { threshold: 0.5 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, [light]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Retrato de Walter Morales impreso en puntos de semitono"
      className={`block w-full cursor-crosshair touch-manipulation ${className}`}
    />
  );
}
