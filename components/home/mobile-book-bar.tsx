"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/** Thumb-reach booking action on phones, between the hero and the closing band. */
export function MobileBookBar() {
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
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 transition-[transform,opacity] duration-300 ease-(--ease-drawer) md:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-[calc(100%+1.5rem)] opacity-0"
      }`}
    >
      <Link href="/book" className="btn w-full min-h-13 text-[1rem]">
        <Icon icon={Calendar03Icon} size={20} />
        Agendar una llamada
      </Link>
    </div>
  );
}
