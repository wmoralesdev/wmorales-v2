"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/site";

type Props = {
  photo: Photo;
  sizes: string;
  className?: string;
  /** Background behind the dots; the dots take the element's text colour. */
  tone?: string;
  priority?: boolean;
  reveal?: boolean;
  /** Fill the positioned parent instead of sizing from the photo. */
  fill?: boolean;
};

/**
 * A photograph printed as halftone. On hover (or, on touch screens, when it sits in
 * the middle of the screen) the dots develop into the real photograph.
 */
export function HalftonePhoto({
  photo,
  sizes,
  className = "",
  tone = "bg-lilac text-ink",
  priority,
  reveal = true,
  fill = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [developed, setDeveloped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setDeveloped(entry.isIntersecting),
      {
        rootMargin: "-42% 0px -42% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      data-reveal={reveal ? "clip" : undefined}
      data-developed={developed || undefined}
      className={`group overflow-clip ${fill ? "absolute inset-0" : "relative"} ${tone} ${className}`}
    >
      <Image
        src={`/photos/${photo.src}.jpg`}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="absolute inset-0 size-full scale-[1.04] object-cover opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-500 ease-(--ease-out) group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none group-data-developed:scale-100 group-data-developed:opacity-100 group-data-developed:blur-none"
      />
      <div
        aria-hidden="true"
        style={
          { "--ht": `url(/halftone/${photo.src}.webp)` } as React.CSSProperties
        }
        className="halftone absolute inset-0 bg-current transition-opacity duration-500 ease-(--ease-out) group-hover:opacity-0 group-data-developed:opacity-0"
      />
    </figure>
  );
}
