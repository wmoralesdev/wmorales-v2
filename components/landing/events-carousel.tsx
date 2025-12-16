"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function EventsCarousel({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 256 + 16; // w-64 + gap-4
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="group/carousel relative">
      {/* Left chevron */}
      <button
        aria-label="Scroll left"
        className={`absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:text-foreground ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => scroll("left")}
        type="button"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-none"
        onScroll={checkScroll}
      >
        {children}
      </div>

      {/* Right chevron */}
      <button
        aria-label="Scroll right"
        className={`absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:text-foreground ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => scroll("right")}
        type="button"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
