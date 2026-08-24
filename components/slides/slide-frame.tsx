import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

interface SlideFrameProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Whether this slide is being rendered for print/PDF export.
   * When true, applies page-break styles.
   */
  printMode?: boolean;
}

const styles = stylex.create({
  frame: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  print: {
    height: "7.5in",
    width: "13.333in",
    flexShrink: 0,
    breakInside: "avoid",
    breakAfter: "page",
  },
  preview: {
    aspectRatio: "16 / 9",
    width: "100%",
  },
  inner: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    padding: "2rem",
    "@media (min-width: 768px)": {
      padding: "3rem",
    },
    "@media (min-width: 1024px)": {
      padding: "4rem",
    },
  },
  canvas: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

/**
 * SlideFrame provides the 16:9 aspect ratio canvas for slides.
 * Uses CSS aspect-ratio for responsive sizing in preview,
 * and fixed dimensions in print mode for PDF export.
 */
export function SlideFrame({
  children,
  className,
  printMode = false,
}: SlideFrameProps) {
  return (
    <div
      {...mergeSx(
        stylex.props(styles.frame, printMode ? styles.print : styles.preview),
        className,
      )}
    >
      <div {...stylex.props(styles.inner)}>{children}</div>
    </div>
  );
}

interface SlideCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideCanvas is a container for the main slide content area,
 * providing consistent spacing and flex layout.
 */
export function SlideCanvas({ children, className }: SlideCanvasProps) {
  return (
    <div {...mergeSx(stylex.props(styles.canvas), className)}>{children}</div>
  );
}
