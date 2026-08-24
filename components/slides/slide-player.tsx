"use client";

import * as stylex from "@stylexjs/stylex";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import type { Presentation } from "@/lib/slides/schema";
import { colors, radii } from "@/lib/stylex/tokens.stylex";
import { Deck } from "./deck";
import { SlideExtras } from "./slide-extras";
import { SlideNavigation } from "./slide-navigation";

interface SlidePlayerProps {
  presentation: Presentation;
  deckSlug: string;
  currentSlide: number;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
  },
  fullscreen: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    height: "100dvh",
    width: "100dvw",
  },
  windowed: {
    minHeight: "calc(100dvh - 3rem)",
  },
  stage: {
    position: "relative",
    display: "flex",
    minHeight: 0,
    flex: 1,
    gap: "1.5rem",
  },
  stageFullscreen: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  stageWindowed: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 10%)`,
    padding: "0.75rem",
    "@media (min-width: 768px)": {
      padding: "1.25rem",
    },
    "@media (min-width: 1024px)": {
      padding: "1.5rem",
    },
  },
  deckFullscreen: {
    display: "flex",
    overflow: "hidden",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  deckWindowed: {
    overflow: "hidden",
    width: "100%",
    maxWidth: "80rem",
    alignSelf: "center",
    borderRadius: radii.lg,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  aspect: {
    aspectRatio: "16 / 9",
    maxHeight: "100dvh",
    width: "100%",
    maxWidth: "100%",
  },
  sidebar: {
    display: "none",
    width: "18rem",
    flexShrink: 0,
    paddingTop: 0,
    "@media (min-width: 1280px)": {
      display: "block",
    },
  },
  floating: {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
  },
  floatingWindowed: {
    "@media (min-width: 1280px)": {
      display: "none",
    },
  },
});

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
      {...stylex.props(
        styles.root,
        isFullscreen ? styles.fullscreen : styles.windowed,
      )}
    >
      <div
        {...stylex.props(
          styles.stage,
          isFullscreen ? styles.stageFullscreen : styles.stageWindowed,
        )}
      >
        <div
          {...stylex.props(
            isFullscreen ? styles.deckFullscreen : styles.deckWindowed,
          )}
        >
          {isFullscreen ? (
            <div {...stylex.props(styles.aspect)}>
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
          <aside {...stylex.props(styles.sidebar)}>
            <SlideExtras slide={slide} variant="sidebar" />
          </aside>
        )}

        {hasExtras && (
          <div
            {...stylex.props(
              styles.floating,
              !isFullscreen && styles.floatingWindowed,
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
