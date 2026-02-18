"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideNavigationProps {
  deckSlug: string;
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function SlideNavigation({
  deckSlug,
  currentSlide,
  totalSlides,
  isFullscreen,
  onToggleFullscreen,
}: SlideNavigationProps) {
  const router = useRouter();

  const goToSlide = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
      if (clampedIndex === currentSlide) return;
      router.push(`/slides/${deckSlug}/${clampedIndex}`);
    },
    [deckSlug, totalSlides, router, currentSlide],
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, goToSlide, totalSlides, onToggleFullscreen]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-t border-border bg-background px-4 py-3",
        isFullscreen && "fixed inset-x-0 bottom-0 z-50",
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/slides">← All Decks</a>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="min-w-[80px] text-center">
          <span className="font-mono text-sm tabular-nums">
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
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>

        <Button variant="outline" size="sm" asChild>
          <a href={`/slides/${deckSlug}/print`} target="_blank" rel="noopener">
            <Printer className="mr-2 size-4" />
            Print
          </a>
        </Button>
      </div>
    </div>
  );
}
