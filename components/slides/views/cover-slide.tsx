import * as stylex from "@stylexjs/stylex";
import type { CoverSlide } from "@/lib/slides/schema";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";
import { SlideBrandMarks } from "../slide-brand-marks";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideHeadline, SlideSubline } from "../slide-typography";

interface CoverSlideViewProps {
  slide: CoverSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  accent: {
    position: "absolute",
    insetInline: 0,
    top: 0,
    height: "0.25rem",
    backgroundColor: colors.accent,
  },
  canvas: {
    justifyContent: "space-between",
  },
  main: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.5rem",
  },
  footer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: "2rem",
  },
  author: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  authorAccent: {
    marginBottom: "0.75rem",
    height: "0.125rem",
    width: "3rem",
    backgroundColor: colors.accent,
  },
  authorName: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  authorTitle: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  marks: {
    justifyContent: "flex-end",
  },
});

/**
 * CoverSlideView renders the cover/title slide.
 * Big title, author info, optional logos.
 */
export function CoverSlideView({
  slide,
  printMode = false,
}: CoverSlideViewProps) {
  const marks =
    slide.brandMarks && slide.brandMarks.length > 0
      ? slide.brandMarks
      : (slide.logos?.map((logo) => ({
          src: logo,
          alt: `Logo ${logo}`,
          size: "lg" as const,
        })) ?? []);

  return (
    <SlideFrame printMode={printMode}>
      <div {...stylex.props(styles.accent)} />

      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <div {...stylex.props(styles.main)}>
          <SlideHeadline multiline>{slide.headline}</SlideHeadline>
          <SlideSubline>{slide.subline}</SlideSubline>
        </div>

        <div {...stylex.props(styles.footer)}>
          <div {...stylex.props(styles.author)}>
            <div {...stylex.props(styles.authorAccent)} />
            <p {...stylex.props(styles.authorName)}>{slide.author.name}</p>
            <p {...stylex.props(styles.authorTitle)}>{slide.author.title}</p>
          </div>

          {marks.length > 0 && (
            <SlideBrandMarks
              marks={marks}
              className={stylex.props(styles.marks).className}
            />
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
