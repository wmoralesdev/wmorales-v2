import type { CoverSlide } from "@/lib/slides/schema";
import { SlideBrandMarks } from "../slide-brand-marks";
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
  const marks =
    slide.brandMarks && slide.brandMarks.length > 0
      ? slide.brandMarks
      : (slide.logos?.map((logo) => ({
          src: logo,
          alt: `Logo ${logo}`,
          size: "lg" as const,
        })) ?? []);

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
          {marks.length > 0 && (
            <SlideBrandMarks marks={marks} className="justify-end" />
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
