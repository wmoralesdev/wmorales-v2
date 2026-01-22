import type {
  BulletsSlide,
  CardsSlide,
  CoverSlide,
  CtaSlide,
  ProfileSlide,
  Slide,
  StatementSlide,
  TimelineSlide,
  TwoColumnSlide,
} from "@/lib/slides/schema";
import {
  BulletsSlideView,
  CardsSlideView,
  CoverSlideView,
  CtaSlideView,
  ProfileSlideView,
  StatementSlideView,
  TimelineSlideView,
  TwoColumnSlideView,
} from "./views";

interface SlideRendererProps {
  slide: Slide;
  printMode?: boolean;
}

/**
 * SlideRenderer handles the discriminated union of slide types
 * and renders the appropriate view component.
 */
export function SlideRenderer({
  slide,
  printMode = false,
}: SlideRendererProps) {
  switch (slide.type) {
    case "cover":
      return (
        <CoverSlideView slide={slide as CoverSlide} printMode={printMode} />
      );
    case "statement":
      return (
        <StatementSlideView
          slide={slide as StatementSlide}
          printMode={printMode}
        />
      );
    case "bullets":
      return (
        <BulletsSlideView slide={slide as BulletsSlide} printMode={printMode} />
      );
    case "profile":
      return (
        <ProfileSlideView slide={slide as ProfileSlide} printMode={printMode} />
      );
    case "timeline":
      return (
        <TimelineSlideView
          slide={slide as TimelineSlide}
          printMode={printMode}
        />
      );
    case "cards":
      return (
        <CardsSlideView slide={slide as CardsSlide} printMode={printMode} />
      );
    case "two-column":
      return (
        <TwoColumnSlideView
          slide={slide as TwoColumnSlide}
          printMode={printMode}
        />
      );
    case "cta":
      return <CtaSlideView slide={slide as CtaSlide} printMode={printMode} />;
    default:
      // Unknown slide type - render nothing
      return null;
  }
}
