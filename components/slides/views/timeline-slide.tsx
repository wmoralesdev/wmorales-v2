import type { TimelineSlide } from "@/lib/slides/schema";
import { SlideChipList } from "../slide-chip-list";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideTimeline } from "../slide-timeline";
import { SlideVisibleResources } from "../slide-visible-resources";
import { SlideHeadline } from "../slide-typography";

interface TimelineSlideViewProps {
  slide: TimelineSlide;
  printMode?: boolean;
}

/**
 * TimelineSlideView renders sequential events or milestones.
 */
export function TimelineSlideView({
  slide,
  printMode = false,
}: TimelineSlideViewProps) {
  // Use horizontal layout for 3-4 events, vertical for 2 or fewer
  const direction = slide.events.length >= 3 ? "horizontal" : "vertical";

  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className="space-y-8">
        <SlideHeadline>{slide.headline}</SlideHeadline>

        {slide.chips && slide.chips.length > 0 && (
          <SlideChipList chips={slide.chips} />
        )}

        <SlideTimeline events={slide.events} direction={direction} />

        {slide.visibleResources && slide.visibleResources.length > 0 && (
          <SlideVisibleResources
            resources={slide.visibleResources}
            title="Prueba y enlaces"
          />
        )}
      </SlideCanvas>
    </SlideFrame>
  );
}
