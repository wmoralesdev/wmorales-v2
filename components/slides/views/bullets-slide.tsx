import type { BulletsSlide } from "@/lib/slides/schema";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideList } from "../slide-list";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface BulletsSlideViewProps {
  slide: BulletsSlide;
  printMode?: boolean;
}

/**
 * BulletsSlideView renders a simple headline + bullet list.
 */
export function BulletsSlideView({
  slide,
  printMode = false,
}: BulletsSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className="space-y-8">
        <SlideHeadline>{slide.headline}</SlideHeadline>

        <SlideList items={slide.items} />

        {slide.footnote && <SlideFootnote>{slide.footnote}</SlideFootnote>}
      </SlideCanvas>
    </SlideFrame>
  );
}
