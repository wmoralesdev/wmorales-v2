"use client";

import * as stylex from "@stylexjs/stylex";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface SlideNavigationProps {
  deckSlug: string;
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const styles = stylex.create({
  fullscreenRoot: {
    position: "fixed",
    insetInline: 0,
    bottom: 0,
    zIndex: 50,
    display: "flex",
    height: "4rem",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  barWrap: {
    transform: "translateY(100%)",
    transitionProperty: "transform",
    transitionDuration: "300ms",
    transitionTimingFunction: "ease-out",
  },
  barWrapVisible: {
    transform: "translateY(0)",
  },
  bar: {
    display: "flex",
    height: "3rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 5%)`,
    paddingInline: "1rem",
    backdropFilter: "blur(4px)",
  },
  barSolid: {
    display: "flex",
    height: "3rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingInline: "1rem",
  },
  group: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  counter: {
    minWidth: "80px",
    textAlign: "center",
  },
  counterText: {
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
  },
  printIcon: {
    marginRight: "0.5rem",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
  },
});

export function SlideNavigation({
  deckSlug,
  currentSlide,
  totalSlides,
  isFullscreen,
  onToggleFullscreen,
}: SlideNavigationProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [navHovered, setNavHovered] = useState(false);
  const printHref =
    resolvedTheme === "light" || resolvedTheme === "dark"
      ? `/slides/${deckSlug}/print?theme=${resolvedTheme}`
      : `/slides/${deckSlug}/print`;

  const goToSlide = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
      if (clampedIndex === currentSlide) return;
      const url = `/slides/${deckSlug}/${clampedIndex}${isFullscreen ? "?fs=1" : ""}`;
      router.push(url);
    },
    [deckSlug, totalSlides, router, currentSlide, isFullscreen],
  );

  const goNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onToggleFullscreen();
          }
          break;
        case "Escape":
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, goToSlide, totalSlides, onToggleFullscreen]);

  if (isFullscreen) {
    return (
      <nav
        aria-label="Fullscreen slide controls"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
        {...stylex.props(styles.fullscreenRoot)}
      >
        <div
          {...stylex.props(styles.barWrap, navHovered && styles.barWrapVisible)}
        >
          <div {...stylex.props(styles.bar)}>
            <div {...stylex.props(styles.group)}>
              <Button
                variant="outline"
                size="icon"
                onClick={goPrev}
                disabled={currentSlide === 0}
                aria-label="Previous slide"
              >
                <ChevronLeft {...stylex.props(icon.md)} />
              </Button>
              <div {...stylex.props(styles.counter)}>
                <span {...stylex.props(styles.counterText)}>
                  {currentSlide + 1} / {totalSlides}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={goNext}
                disabled={currentSlide === totalSlides - 1}
                aria-label="Next slide"
              >
                <ChevronRight {...stylex.props(icon.md)} />
              </Button>
            </div>
            <div {...stylex.props(styles.group)}>
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleFullscreen}
                aria-label="Exit fullscreen"
              >
                <Minimize2 {...stylex.props(icon.md)} />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={printHref} target="_blank" rel="noopener">
                  <Printer {...stylex.props(styles.printIcon)} />
                  Print
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div {...stylex.props(styles.barSolid)}>
      <div {...stylex.props(styles.group)}>
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft {...stylex.props(icon.md)} />
        </Button>

        <div {...stylex.props(styles.counter)}>
          <span {...stylex.props(styles.counterText)}>
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          aria-label="Next slide"
        >
          <ChevronRight {...stylex.props(icon.md)} />
        </Button>
      </div>

      <div {...stylex.props(styles.group)}>
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 {...stylex.props(icon.md)} />
          ) : (
            <Maximize2 {...stylex.props(icon.md)} />
          )}
        </Button>

        <Button variant="outline" size="sm" asChild>
          <a href={printHref} target="_blank" rel="noopener">
            <Printer {...stylex.props(styles.printIcon)} />
            Print
          </a>
        </Button>
      </div>
    </div>
  );
}
