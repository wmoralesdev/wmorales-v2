import * as stylex from "@stylexjs/stylex";
import type { TwoColumnSlide } from "@/lib/slides/schema";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideTwoColumn } from "../slide-two-column";
import { SlideHeadline } from "../slide-typography";

interface TwoColumnSlideViewProps {
  slide: TwoColumnSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  canvas: {
    gap: "2rem",
  },
});

/**
 * TwoColumnSlideView renders side-by-side content comparison.
 */
export function TwoColumnSlideView({
  slide,
  printMode = false,
}: TwoColumnSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideTwoColumn left={slide.left} right={slide.right} />
      </SlideCanvas>
    </SlideFrame>
  );
}
