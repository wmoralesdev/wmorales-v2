import type { TwoColumnSlide } from "@/lib/slides/schema";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideTwoColumn } from "../slide-two-column";
import { SlideHeadline } from "../slide-typography";

interface TwoColumnSlideViewProps {
  slide: TwoColumnSlide;
  printMode?: boolean;
}

/**
 * TwoColumnSlideView renders side-by-side content comparison.
 */
export function TwoColumnSlideView({
  slide,
  printMode = false,
}: TwoColumnSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className="space-y-8">
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideTwoColumn left={slide.left} right={slide.right} />
      </SlideCanvas>
    </SlideFrame>
  );
}
