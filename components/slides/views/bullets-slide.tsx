import * as stylex from "@stylexjs/stylex";
import type { BulletsSlide } from "@/lib/slides/schema";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideList } from "../slide-list";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface BulletsSlideViewProps {
  slide: BulletsSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  canvas: {
    gap: "2rem",
  },
});

/**
 * BulletsSlideView renders a simple headline + bullet list.
 */
export function BulletsSlideView({
  slide,
  printMode = false,
}: BulletsSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideList items={slide.items} />

        {printMode && slide.footnote && (
          <SlideFootnote>{slide.footnote}</SlideFootnote>
        )}
      </SlideCanvas>
    </SlideFrame>
  );
}
