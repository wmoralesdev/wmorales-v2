"use client";

import * as stylex from "@stylexjs/stylex";
import { useTheme } from "next-themes";
import type { Presentation } from "@/lib/slides/schema";
import {
  generateSlideTheme,
  themeTokensToCSSProperties,
} from "@/lib/slides/theme";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";
import { SlideRenderer } from "./slide-renderer";

interface DeckProps {
  presentation: Presentation;
  /**
   * When true, renders all slides stacked with page breaks for print/PDF.
   * When false, renders only the current slide index.
   */
  printMode?: boolean;
  /**
   * Current slide index (0-based). Only used when printMode is false.
   */
  currentSlide?: number;
  className?: string;
  printThemeOverride?: "light" | "dark";
}

const styles = stylex.create({
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  meta: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  language: {
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
});

/**
 * Deck component wraps a presentation with theme tokens
 * and renders slides for preview or print.
 */
export function Deck({
  presentation,
  printMode = false,
  currentSlide = 0,
  className,
  printThemeOverride,
}: DeckProps) {
  const { resolvedTheme } = useTheme();
  const { meta, slides } = presentation;

  const effectiveTheme = printMode
    ? (printThemeOverride ?? meta.theme)
    : (resolvedTheme ?? meta.theme) === "dark"
      ? "dark"
      : "light";
  const themeTokens = generateSlideTheme(meta, effectiveTheme);
  const themeClass = effectiveTheme === "dark" ? "dark" : "";

  if (printMode) {
    return (
      <div
        {...mergeSx(
          { className: undefined },
          [themeClass, className].filter(Boolean).join(" ") || undefined,
          themeTokensToCSSProperties(themeTokens),
        )}
      >
        {slides.map((slide, index) => (
          <SlideRenderer
            key={`${index}-${slide.type}-${slide.headline}`}
            slide={slide}
            printMode
          />
        ))}
      </div>
    );
  }

  const slideIndex = Math.max(0, Math.min(currentSlide, slides.length - 1));
  const slide = slides[slideIndex];

  return (
    <div
      {...mergeSx(
        { className: undefined },
        [themeClass, className].filter(Boolean).join(" ") || undefined,
        themeTokensToCSSProperties(themeTokens),
      )}
    >
      <SlideRenderer slide={slide} />
    </div>
  );
}

interface DeckInfoProps {
  presentation: Presentation;
}

/**
 * DeckInfo displays metadata about the presentation.
 */
export function DeckInfo({ presentation }: DeckInfoProps) {
  const { meta, slides } = presentation;

  return (
    <div {...stylex.props(styles.info)}>
      <h1 {...stylex.props(styles.title)}>{meta.title}</h1>
      <p {...stylex.props(styles.meta)}>
        By {meta.author} · {slides.length} slides
      </p>
      {meta.language && (
        <p {...stylex.props(styles.language)}>Language: {meta.language}</p>
      )}
    </div>
  );
}
