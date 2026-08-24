import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import type { ProfileSlide } from "@/lib/slides/schema";
import { colors, radii } from "@/lib/stylex/tokens.stylex";
import { SlideBrandMarks } from "../slide-brand-marks";
import { SlideChipList } from "../slide-chip-list";
import { SlideCredentials } from "../slide-credentials";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideBody, SlideHeadline, SlideSubline } from "../slide-typography";
import { SlideVisibleResources } from "../slide-visible-resources";

interface ProfileSlideViewProps {
  slide: ProfileSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  row: {
    display: "flex",
    gap: "1.25rem",
    "@media (min-width: 768px)": {
      gap: "2rem",
    },
  },
  imageWrap: {
    position: "relative",
    aspectRatio: "1 / 1",
    width: "6rem",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: radii.xl,
    boxShadow: `0 0 0 2px ${colors.background}, 0 0 0 4px color-mix(in oklch, ${colors.accent}, transparent 70%)`,
    "@media (min-width: 768px)": {
      width: "7rem",
    },
    "@media (min-width: 1024px)": {
      width: "9rem",
    },
  },
  image: {
    objectFit: "cover",
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "1rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  headline: {
    fontSize: "1.5rem",
    "@media (min-width: 768px)": {
      fontSize: "1.875rem",
    },
    "@media (min-width: 1024px)": {
      fontSize: "2.25rem",
    },
  },
  subline: {
    fontSize: "1rem",
    "@media (min-width: 768px)": {
      fontSize: "1.125rem",
    },
  },
  body: {
    fontSize: "0.875rem",
    "@media (min-width: 768px)": {
      fontSize: "1rem",
    },
  },
  credentials: {
    gap: "1rem",
  },
});

/**
 * ProfileSlideView renders a personal/bio slide with credentials.
 */
export function ProfileSlideView({
  slide,
  printMode = false,
}: ProfileSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas>
        <div {...stylex.props(styles.row)}>
          {slide.image && (
            <div {...stylex.props(styles.imageWrap)}>
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                sizes="(max-width: 768px) 6rem, (max-width: 1024px) 7rem, 9rem"
                {...stylex.props(styles.image)}
              />
            </div>
          )}

          <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
              <SlideHeadline
                className={stylex.props(styles.headline).className}
              >
                {slide.headline}
              </SlideHeadline>
              <SlideSubline className={stylex.props(styles.subline).className}>
                {slide.subtitle}
              </SlideSubline>
            </div>

            {slide.chips && slide.chips.length > 0 && (
              <SlideChipList chips={slide.chips} />
            )}

            <SlideBody className={stylex.props(styles.body).className}>
              {slide.bio}
            </SlideBody>

            {slide.brandMarks && slide.brandMarks.length > 0 && (
              <SlideBrandMarks marks={slide.brandMarks} compact />
            )}

            {slide.credentials.length > 0 && (
              <SlideCredentials
                credentials={slide.credentials}
                className={stylex.props(styles.credentials).className}
              />
            )}

            {slide.visibleResources && slide.visibleResources.length > 0 && (
              <SlideVisibleResources
                resources={slide.visibleResources}
                title="Enlaces"
                compact
              />
            )}
          </div>
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
