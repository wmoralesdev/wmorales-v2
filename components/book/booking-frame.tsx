"use client";

import { ArrowUpRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Google Calendar's booking page can't be restyled from outside, so it sits inside a
 * frame that belongs to the site: an ink header, a halftone edge and a halftone
 * loading screen that dissolves once the calendar is ready.
 */
export function BookingFrame({
  src,
  fallback,
  t,
}: {
  src: string;
  fallback: string;
  t: Dictionary["book"]["frame"];
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-ink px-4 py-3 text-paper sm:px-5">
        <span className="flex items-center gap-2.5 font-semibold text-small">
          <Icon icon={Calendar03Icon} size={18} />
          {t.available}
        </span>
        <span className="text-paper/65 text-small">{t.localTime}</span>
      </div>
      <div
        aria-hidden="true"
        className="dot-screen h-2 bg-ink [--dot-r:30%] [--dot-size:8px] [--dot:var(--color-paper)]"
      />

      <div className="relative h-[max(42rem,78svh)] bg-white md:h-[46rem]">
        <iframe
          src={src}
          title={t.iframe}
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 size-full border-0"
          loading="eager"
        />
        <div
          aria-hidden={loaded}
          className={`pointer-events-none absolute inset-0 grid place-items-center bg-paper transition-opacity duration-500 ease-(--ease-out) ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Loading state, not decoration. taste-skill-ignore */}
          <div className="dot-screen absolute inset-0 animate-pulse opacity-40 [--dot-r:18%] [--dot-size:14px]" />
          <p
            className="relative bg-paper px-3 py-1.5 font-semibold text-small"
            role="status"
          >
            {t.loading}
          </p>
        </div>
      </div>

      <a
        href={fallback}
        target="_blank"
        rel="noopener noreferrer"
        className="press mt-4 inline-flex items-center gap-1.5 self-start text-muted text-small hover:text-ink"
      >
        {t.fallback}
        <Icon icon={ArrowUpRight01Icon} size={16} />
      </a>
    </div>
  );
}
