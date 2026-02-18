"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Presentation } from "@/lib/slides/schema";
import { cn } from "@/lib/utils";
import { Deck } from "./deck";
import { SlideExtras } from "./slide-extras";
import { SlideNavigation } from "./slide-navigation";

interface SlidePlayerProps {
  presentation: Presentation;
  deckSlug: string;
  currentSlide: number;
}

export function SlidePlayer({
  presentation,
  deckSlug,
  currentSlide,
}: SlidePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const slideIndex = Math.max(
    0,
    Math.min(currentSlide, presentation.slides.length - 1),
  );
  const slide = presentation.slides[slideIndex];
  const hasExtras =
    (slide.footnotes && slide.footnotes.length > 0) ||
    (slide.resources && slide.resources.length > 0);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col bg-background",
        isFullscreen ? "h-dvh w-dvw" : "min-h-[calc(100dvh-6rem)]",
      )}
    >
      <div
        className={cn(
          "relative flex flex-1 gap-6",
          isFullscreen
            ? "items-center justify-center bg-black"
            : "items-start justify-center bg-muted/90 p-4 md:p-8",
        )}
      >
        <div
          className={cn(
            "overflow-hidden",
            isFullscreen
              ? "flex h-full w-full items-center justify-center"
              : "w-full max-w-5xl rounded-lg shadow-lg",
          )}
        >
          {isFullscreen ? (
            <div className="aspect-video max-h-[calc(100dvh-3.5rem)] w-full max-w-full">
              <Deck
                presentation={presentation}
                currentSlide={currentSlide}
                printMode={false}
              />
            </div>
          ) : (
            <Deck
              presentation={presentation}
              currentSlide={currentSlide}
              printMode={false}
            />
          )}
        </div>

        {hasExtras && !isFullscreen && (
          <aside className="hidden w-72 shrink-0 pt-0 xl:block">
            <SlideExtras slide={slide} variant="sidebar" />
          </aside>
        )}

        {hasExtras && (
          <div
            className={cn(
              "absolute bottom-4 right-4",
              !isFullscreen && "xl:hidden",
            )}
          >
            <SlideExtras slide={slide} variant="floating" />
          </div>
        )}
      </div>

      <SlideNavigation
        deckSlug={deckSlug}
        currentSlide={currentSlide}
        totalSlides={presentation.slides.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
