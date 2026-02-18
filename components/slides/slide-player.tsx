"use client";

import { useQueryState } from "nuqs";
import { useCallback } from "react";
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
  const [fsParam, setFsParam] = useQueryState("fs", {
    defaultValue: "",
    shallow: true,
  });
  const isFullscreen = fsParam === "1";

  const toggleFullscreen = useCallback(() => {
    setFsParam(isFullscreen ? null : "1");
  }, [isFullscreen, setFsParam]);

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
      className={cn(
        "flex flex-col bg-background",
        isFullscreen
          ? "fixed inset-0 z-50 h-dvh w-dvw"
          : "min-h-[calc(100dvh-3rem)]",
      )}
    >
      <div
        className={cn(
          "relative flex min-h-0 flex-1 gap-6",
          isFullscreen
            ? "items-center justify-center bg-black"
            : "items-center justify-center bg-muted/90 p-4 md:p-8",
        )}
      >
        <div
          className={cn(
            "overflow-hidden",
            isFullscreen
              ? "flex h-full w-full items-center justify-center"
              : "w-full max-w-5xl self-center rounded-lg shadow-lg",
          )}
        >
          {isFullscreen ? (
            <div className="aspect-video max-h-dvh w-full max-w-full">
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
