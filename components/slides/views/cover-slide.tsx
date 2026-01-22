import Image from "next/image";
import type { CoverSlide } from "@/lib/slides/schema";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideHeadline, SlideSubline } from "../slide-typography";

interface CoverSlideViewProps {
  slide: CoverSlide;
  printMode?: boolean;
}

/**
 * CoverSlideView renders the cover/title slide.
 * Big title, author info, optional logos.
 */
export function CoverSlideView({
  slide,
  printMode = false,
}: CoverSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      {/* Accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

      <SlideCanvas className="justify-between">
        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center space-y-6">
          <SlideHeadline multiline>{slide.headline}</SlideHeadline>
          <SlideSubline>{slide.subline}</SlideSubline>
        </div>

        {/* Author and logos */}
        <div className="flex items-end justify-between pt-8">
          {/* Author info */}
          <div className="space-y-1">
            <div className="mb-3 h-0.5 w-12 bg-accent" />
            <p className="font-display text-lg font-semibold text-foreground">
              {slide.author.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {slide.author.title}
            </p>
          </div>

          {/* Logos */}
          {slide.logos && slide.logos.length > 0 && (
            <div className="flex items-center gap-6">
              {slide.logos.map((logo) => (
                <div
                  key={logo}
                  className="relative size-16 overflow-hidden opacity-80 transition-opacity hover:opacity-100"
                >
                  {logo.startsWith("http") || logo.startsWith("/") ? (
                    <Image
                      src={logo}
                      alt={`Logo ${logo}`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      {logo}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
