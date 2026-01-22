import type { Presentation } from "@/lib/slides/schema";
import {
  generateSlideTheme,
  themeTokensToCSSProperties,
} from "@/lib/slides/theme";
import { cn } from "@/lib/utils";
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
}

/**
 * Deck component wraps a presentation with theme tokens
 * and renders slides for preview or print.
 */
export function Deck({
  presentation,
  printMode = false,
  currentSlide = 0,
  className,
}: DeckProps) {
  const { meta, slides } = presentation;
  const themeTokens = generateSlideTheme(meta);

  const themeClass = meta.theme === "dark" ? "dark" : "";

  if (printMode) {
    return (
      <div
        className={cn(themeClass, className)}
        style={themeTokensToCSSProperties(themeTokens)}
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
      className={cn(themeClass, className)}
      style={themeTokensToCSSProperties(themeTokens)}
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
    <div className="space-y-2">
      <h1 className="font-display text-xl font-semibold text-foreground">
        {meta.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        By {meta.author} · {slides.length} slides
      </p>
      {meta.language && (
        <p className="text-xs text-muted-foreground">
          Language: {meta.language}
        </p>
      )}
    </div>
  );
}
