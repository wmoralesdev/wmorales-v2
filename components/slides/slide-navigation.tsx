"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideNavigationProps {
  deckSlug: string;
  currentSlide: number;
  totalSlides: number;
}

/**
 * Client-side navigation controls for slide preview.
 */
export function SlideNavigation({
  deckSlug,
  currentSlide,
  totalSlides,
}: SlideNavigationProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
      if (clampedIndex === currentSlide) return;
      router.push(`/slides/${deckSlug}?slide=${clampedIndex}`);
    },
    [deckSlug, totalSlides, router, currentSlide],
  );

  const goNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

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
            toggleFullscreen();
          }
          break;
        case "Escape":
          break;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [goNext, goPrev, goToSlide, totalSlides, toggleFullscreen]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-t border-border bg-background px-4 py-3",
        isFullscreen && "fixed inset-x-0 bottom-0 z-50",
      )}
    >
      {/* Left: Back link */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/slides">← All Decks</a>
        </Button>
      </div>

      {/* Center: Navigation */}
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

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
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
