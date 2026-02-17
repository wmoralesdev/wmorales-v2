"use client";

import {
  Children,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function EventsCarousel({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Autoplay pause state
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Drag-to-scroll (mouse) + click suppression
  const dragStateRef = useRef<{
    pointerId: number | null;
    startClientX: number;
    startScrollLeft: number;
    dragged: boolean;
  }>({ pointerId: null, startClientX: 0, startScrollLeft: 0, dragged: false });
  const suppressNextClickRef = useRef(false);

  const itemsCount = useMemo(() => Children.count(children), [children]);

  const checkScrollRafRef = useRef<number | null>(null);
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scheduleCheckScroll = useCallback(() => {
    if (checkScrollRafRef.current != null) {
      cancelAnimationFrame(checkScrollRafRef.current);
    }
    checkScrollRafRef.current = requestAnimationFrame(() => {
      checkScroll();
      checkScrollRafRef.current = null;
    });
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const getItems = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-item]"));
  }, []);

  const getNearestIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const items = getItems();
    if (items.length === 0) return 0;

    const currentLeft = el.scrollLeft;
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < items.length; i += 1) {
      const dist = Math.abs(items[i].offsetLeft - currentLeft);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    return bestIdx;
  }, [getItems]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const items = getItems();
      if (items.length === 0) return;

      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      el.scrollTo({ left: items[clamped].offsetLeft, behavior: "smooth" });
    },
    [getItems],
  );

  const scrollByOne = useCallback(
    (direction: "left" | "right") => {
      const items = getItems();
      if (items.length === 0) return;

      const currentIdx = getNearestIndex();
      const nextIdx = direction === "left" ? currentIdx - 1 : currentIdx + 1;
      scrollToIndex(nextIdx);
    },
    [getItems, getNearestIndex, scrollToIndex],
  );

  // Reduced motion / visibility (autoplay safeguards)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setPrefersReducedMotion(mql.matches);
    set();

    // Safari < 14 uses addListener/removeListener
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", set);
      return () => mql.removeEventListener("change", set);
    }

    // biome-ignore lint/suspicious/noExplicitAny: legacy Safari API
    (mql as any).addListener(set);
    return () => {
      // biome-ignore lint/suspicious/noExplicitAny: legacy Safari API
      (mql as any).removeListener(set);
    };
  }, []);

  // Keep arrow state in sync with layout/content changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Run after layout (more than once to catch late layout).
    const raf1 = requestAnimationFrame(() => checkScroll());
    const raf2 = requestAnimationFrame(() => checkScroll());
    const t1 = window.setTimeout(() => checkScroll(), 0);
    const t2 = window.setTimeout(() => checkScroll(), 250);

    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(el);

    // Also observe item wrappers (in case their widths change).
    const items = getItems();
    for (const item of items) resizeObserver.observe(item);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      resizeObserver.disconnect();
    };
  }, [checkScroll, getItems]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVis = () =>
      setIsDocumentVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Autoplay: advance by one item, loop back to start
  const autoplayEnabled = useMemo(() => {
    if (itemsCount <= 1) return false;
    if (prefersReducedMotion) return false;
    if (!isDocumentVisible) return false;
    if (isHovered) return false;
    if (isFocusedWithin) return false;
    if (isPointerDown) return false;
    return true;
  }, [
    isDocumentVisible,
    isFocusedWithin,
    isHovered,
    isPointerDown,
    itemsCount,
    prefersReducedMotion,
  ]);

  useEffect(() => {
    if (!autoplayEnabled) return;

    const intervalMs = 7000;
    const id = window.setInterval(() => {
      const items = getItems();
      if (items.length <= 1) return;

      const currentIdx = getNearestIndex();
      const nextIdx = currentIdx >= items.length - 1 ? 0 : currentIdx + 1;
      scrollToIndex(nextIdx);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplayEnabled, getItems, getNearestIndex, scrollToIndex]);

  const handleFocusCapture = useCallback(() => {
    setIsFocusedWithin(true);
  }, []);

  const handleBlurCapture = useCallback(() => {
    // Let focus settle before checking if we truly left the carousel.
    requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) {
        setIsFocusedWithin(false);
        return;
      }
      const active = document.activeElement;
      setIsFocusedWithin(active ? root.contains(active) : false);
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      setIsPointerDown(true);

      if (e.pointerType !== "mouse") {
        // Touch already gets great swipe scrolling from the browser.
        return;
      }

      const el = scrollRef.current;
      if (!el) return;

      dragStateRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startScrollLeft: el.scrollLeft,
        dragged: false,
      };

      suppressNextClickRef.current = false;
      el.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;

      const el = scrollRef.current;
      const state = dragStateRef.current;
      if (!el) return;
      if (state.pointerId == null) return;
      if (state.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - state.startClientX;
      const nextLeft = state.startScrollLeft - deltaX;
      el.scrollLeft = nextLeft;

      if (!state.dragged && Math.abs(deltaX) >= 6) {
        state.dragged = true;
      }
    },
    [],
  );

  const endPointerDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    setIsPointerDown(false);

    if (e.pointerType !== "mouse") return;

    const el = scrollRef.current;
    const state = dragStateRef.current;
    if (!el) return;
    if (state.pointerId == null) return;
    if (state.pointerId !== e.pointerId) return;

    suppressNextClickRef.current = state.dragged;
    dragStateRef.current.pointerId = null;

    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
  }, []);

  const handleClickCapture = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressNextClickRef.current) return;
      suppressNextClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  return (
    <section
      aria-label="Events carousel"
      className="group/carousel relative"
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={rootRef}
    >
      {/* Left chevron */}
      <button
        aria-label="Scroll left"
        aria-disabled={!canScrollLeft}
        className={`absolute -left-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:text-foreground ${
          canScrollLeft ? "opacity-100" : "opacity-50"
        }`}
        onClick={() => scrollByOne("left")}
        type="button"
      >
        <FiChevronLeft className="size-4" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="relative flex gap-4 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory touch-pan-x select-none cursor-grab active:cursor-grabbing"
        onClickCapture={handleClickCapture}
        onPointerCancel={endPointerDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onScroll={scheduleCheckScroll}
      >
        {Children.toArray(children).map((child) => (
          <div
            className="snap-start shrink-0"
            data-carousel-item=""
            // Children.toArray preserves the original element keys.
            key={(child as { key?: string | null }).key ?? undefined}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right chevron */}
      <button
        aria-label="Scroll right"
        aria-disabled={!canScrollRight}
        className={`absolute -right-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:text-foreground ${
          canScrollRight ? "opacity-100" : "opacity-50"
        }`}
        onClick={() => scrollByOne("right")}
        type="button"
      >
        <FiChevronRight className="size-4" />
      </button>
    </section>
  );
}
