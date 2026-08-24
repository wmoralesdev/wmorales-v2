import * as stylex from "@stylexjs/stylex";
import type { TimelineSlide } from "@/lib/slides/schema";
import { SlideChipList } from "../slide-chip-list";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideTimeline } from "../slide-timeline";
import { SlideHeadline } from "../slide-typography";
import { SlideVisibleResources } from "../slide-visible-resources";

interface TimelineSlideViewProps {
  slide: TimelineSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  canvas: {
    gap: "2rem",
  },
});

/**
 * TimelineSlideView renders sequential events or milestones.
 */
export function TimelineSlideView({
  slide,
  printMode = false,
}: TimelineSlideViewProps) {
  const direction = slide.events.length >= 3 ? "horizontal" : "vertical";

  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas className={stylex.props(styles.canvas).className}>
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
