import type { StatementSlide } from "@/lib/slides/schema";
import { SlideBreakdown } from "../slide-breakdown";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideList } from "../slide-list";
import {
  SlideBody,
  SlideFootnote,
  SlideHeadline,
  SlideQuote,
} from "../slide-typography";

interface StatementSlideViewProps {
  slide: StatementSlide;
  printMode?: boolean;
}

/**
 * StatementSlideView renders a bold statement with optional supporting content.
 * Supports body text OR bullet items (mutually exclusive).
 */
export function StatementSlideView({
  slide,
  printMode = false,
}: StatementSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className="space-y-8">
        {/* Main headline */}
        <SlideHeadline multiline>{slide.headline}</SlideHeadline>

        {/* Supporting content: body OR items */}
        {slide.body && <SlideBody>{slide.body}</SlideBody>}

        {slide.items && slide.items.length > 0 && (
          <SlideList items={slide.items} />
        )}

        {/* Breakdown stats */}
        {slide.breakdown && slide.breakdown.length > 0 && (
          <SlideBreakdown
            items={slide.breakdown}
            variant={slide.breakdown.length <= 3 ? "stats" : "bars"}
          />
        )}

        {/* Pull quote */}
        {slide.quote && <SlideQuote>{slide.quote}</SlideQuote>}

        {/* Footnote */}
        {slide.footnote && <SlideFootnote>{slide.footnote}</SlideFootnote>}
      </SlideCanvas>
    </SlideFrame>
  );
}
