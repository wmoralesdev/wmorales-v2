"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useRef, useState } from "react";

export type QrTarget = {
  id: string;
  label: string;
  caption: string;
  value: string;
  svg?: string;
};

/**
 * One QR code with tabs for what it opens: this card, the vCard or the calendar.
 * The code always prints dark on snow, in either theme, so any camera reads it.
 * `id` keeps the tab wiring unique when the panel is on the page twice (the sheet
 * on phones, inline on desktop).
 */
export function QrPanel({
  id,
  targets,
  tabsLabel,
  codeLabel,
  className = "",
}: {
  id: string;
  targets: QrTarget[];
  tabsLabel: string;
  codeLabel: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = targets[active];

  function onKey(e: KeyboardEvent) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + targets.length) % targets.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  const swap = reduce
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.97, filter: "blur(4px)" };

  return (
    <div className={className}>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-label={current.label}
        className="relative grid aspect-square place-items-center overflow-clip bg-snow p-6"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            role="img"
            aria-label={`${codeLabel}: ${current.caption}`}
            initial={swap}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={swap}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="size-full [&_svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated on the server by the qrcode library.
            dangerouslySetInnerHTML={{ __html: current.svg ?? "" }}
          />
        </AnimatePresence>
      </div>

      <div
        role="tablist"
        aria-label={tabsLabel}
        onKeyDown={onKey}
        className="relative mt-2 grid grid-cols-3 bg-surface p-1"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] bg-ink transition-transform duration-250 ease-(--ease-out) motion-reduce:transition-none"
          style={{ transform: `translateX(${active * 100}%)` }}
        />
        {targets.map((target, i) => (
          <button
            key={target.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`press relative z-10 min-h-11 font-semibold text-small transition-colors duration-200 ${
              i === active ? "text-paper" : "text-ink"
            }`}
          >
            {target.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-muted text-small" aria-live="polite">
        {current.caption}
      </p>
    </div>
  );
}
