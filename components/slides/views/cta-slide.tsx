import * as stylex from "@stylexjs/stylex";
import QRCode from "react-qr-code";
import type { CtaSlide } from "@/lib/slides/schema";
import { colors, radii } from "@/lib/stylex/tokens.stylex";
import { SlideContact } from "../slide-contact";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideNumberedSteps } from "../slide-list";
import { SlideHeadline } from "../slide-typography";
import { SlideVisibleResources } from "../slide-visible-resources";

interface CtaSlideViewProps {
  slide: CtaSlide;
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
    gap: "1.5rem",
  },
  row: {
    display: "flex",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gap: "2rem",
    },
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  steps: {
    gap: "0.75rem",
  },
  aside: {
    display: "flex",
    width: "11rem",
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  qr: {
    overflow: "hidden",
    borderRadius: radii.xl,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.accent}, transparent 70%)`,
    backgroundColor: "white",
    padding: "1rem",
    boxShadow: `0 10px 15px -3px color-mix(in oklch, ${colors.accent}, transparent 90%)`,
  },
  qrLabel: {
    maxWidth: "160px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  resources: {
    width: "100%",
  },
});

/**
 * CtaSlideView renders a call-to-action with steps, contact info, and optional QR.
 */
export function CtaSlideView({ slide, printMode = false }: CtaSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <div {...stylex.props(styles.accent)} />

      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <SlideHeadline multiline>{slide.headline}</SlideHeadline>

        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.main)}>
            <SlideNumberedSteps
              steps={slide.steps}
              className={stylex.props(styles.steps).className}
            />
            <SlideContact contact={slide.contact} compact />
          </div>

          {(slide.qr ||
            (slide.visibleResources && slide.visibleResources.length > 0)) && (
            <div {...stylex.props(styles.aside)}>
              {slide.qr && (
                <div {...stylex.props(styles.qr)}>
                  <QRCode
                    value={slide.qr.url}
                    size={112}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              )}
              {slide.qr && (
                <p {...stylex.props(styles.qrLabel)}>
                  {slide.qr.label ?? slide.qr.url}
                </p>
              )}
              {slide.visibleResources && slide.visibleResources.length > 0 && (
                <SlideVisibleResources
                  resources={slide.visibleResources}
                  title="Mantengamos el contacto"
                  compact
                  className={stylex.props(styles.resources).className}
                />
              )}
            </div>
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
