import type { CardsSlide } from "@/lib/slides/schema";
import { SlideCardGrid } from "../slide-card-grid";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface CardsSlideViewProps {
  slide: CardsSlide;
  printMode?: boolean;
}

/**
 * CardsSlideView renders a grid of content cards.
 */
export function CardsSlideView({
  slide,
  printMode = false,
}: CardsSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className="space-y-8">
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideCardGrid cards={slide.cards} />

        {slide.footnote && <SlideFootnote>{slide.footnote}</SlideFootnote>}
      </SlideCanvas>
    </SlideFrame>
  );
}
