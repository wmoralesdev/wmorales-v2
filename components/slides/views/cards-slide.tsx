import * as stylex from "@stylexjs/stylex";
import type { CardsSlide } from "@/lib/slides/schema";
import { SlideCardGrid } from "../slide-card-grid";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface CardsSlideViewProps {
  slide: CardsSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  canvas: {
    gap: "2rem",
  },
});

/**
 * CardsSlideView renders a grid of content cards.
 */
export function CardsSlideView({
  slide,
  printMode = false,
}: CardsSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideCardGrid cards={slide.cards} />

        {printMode && slide.footnote && (
          <SlideFootnote>{slide.footnote}</SlideFootnote>
        )}
      </SlideCanvas>
    </SlideFrame>
  );
}
