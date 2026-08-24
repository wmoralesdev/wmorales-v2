"use client";

import * as stylex from "@stylexjs/stylex";
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
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
  },
  chevron: {
    position: "absolute",
    top: "50%",
    zIndex: 20,
    display: "flex",
    width: "2rem",
    height: "2rem",
    transform: "translateY(-50%)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 10%)`,
    color: colors.mutedForeground,
    backdropFilter: "blur(4px)",
    transitionProperty: "border-color, color, opacity",
    transitionDuration: "150ms",
    cursor: "pointer",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
      color: colors.foreground,
    },
  },
  chevronLeft: {
    left: "-0.75rem",
  },
  chevronRight: {
    right: "-0.75rem",
  },
  chevronEnabled: {
    opacity: 1,
  },
  chevronDisabled: {
    opacity: 0.5,
  },
  chevronIcon: {
    width: "1rem",
    height: "1rem",
  },
  scroller: {
    position: "relative",
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollSnapType: "x mandatory",
    touchAction: "pan-x",
    userSelect: "none",
    cursor: "grab",
    ":active": {
      cursor: "grabbing",
    },
  },
  item: {
    scrollSnapAlign: "start",
    flexShrink: 0,
  },
});

export function EventsCarousel({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setPrefersReducedMotion(mql.matches);
    set();

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const raf1 = requestAnimationFrame(() => checkScroll());
    const raf2 = requestAnimationFrame(() => checkScroll());
    const t1 = window.setTimeout(() => checkScroll(), 0);
    const t2 = window.setTimeout(() => checkScroll(), 250);

    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(el);

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
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={rootRef}
      {...stylex.props(styles.root)}
    >
      <button
        aria-label="Scroll left"
        aria-disabled={!canScrollLeft}
        onClick={() => scrollByOne("left")}
        type="button"
        {...stylex.props(
          styles.chevron,
          styles.chevronLeft,
          canScrollLeft ? styles.chevronEnabled : styles.chevronDisabled,
        )}
      >
        <FiChevronLeft {...stylex.props(styles.chevronIcon)} />
      </button>

      <div
        ref={scrollRef}
        onClickCapture={handleClickCapture}
        onPointerCancel={endPointerDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onScroll={scheduleCheckScroll}
        {...mergeSx(stylex.props(styles.scroller), "scrollbar-none")}
      >
        {Children.toArray(children).map((child) => (
          <div
            data-carousel-item=""
            key={(child as { key?: string | null }).key ?? undefined}
            {...stylex.props(styles.item)}
          >
            {child}
          </div>
        ))}
      </div>

      <button
        aria-label="Scroll right"
        aria-disabled={!canScrollRight}
        onClick={() => scrollByOne("right")}
        type="button"
        {...stylex.props(
          styles.chevron,
          styles.chevronRight,
          canScrollRight ? styles.chevronEnabled : styles.chevronDisabled,
        )}
      >
        <FiChevronRight {...stylex.props(styles.chevronIcon)} />
      </button>
    </section>
  );
}
