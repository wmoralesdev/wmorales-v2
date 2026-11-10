"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/** Thumb-reach booking action on phones, between the hero and the closing band. */
export function MobileBookBar({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const end = document.getElementById("contacto");
    if (!hero || !end) return;
    const seen = { hero: true, end: false };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) seen.hero = e.isIntersecting;
        if (e.target === end)
          seen.end = e.isIntersecting || e.boundingClientRect.top < 0;
      }
      setShow(!seen.hero && !seen.end);
    });
    io.observe(hero);
    io.observe(end);
    return () => io.disconnect();
  }, []);

  return (
    <div
      inert={!show}
      className={`fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-[4.75rem] z-30 transition-[transform,opacity] duration-300 ease-(--ease-drawer) motion-reduce:transition-none md:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-[calc(100%+1.5rem)] opacity-0"
      }`}
    >
      {/* The same tray as the card's bar on /intro; the Tools button sits in the
          corner beside it. */}
      <div className="bg-ink p-1.5 shadow-[0_18px_50px_-12px_rgb(18_13_38/0.5)]">
        <Link
          href={href}
          className="btn w-full [--btn-bg-hover:var(--color-accent-deep)]"
        >
          <Icon icon={Calendar03Icon} size={18} />
          {label}
        </Link>
      </div>
    </div>
  );
}
