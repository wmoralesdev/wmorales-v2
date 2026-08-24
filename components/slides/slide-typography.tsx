import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface SlideHeadlineProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Render headline with line breaks from \n in the source.
   */
  multiline?: boolean;
}

const styles = stylex.create({
  headline: {
    fontFamily: fonts.display,
    fontSize: "2.25rem",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    textWrap: "balance",
    color: colors.foreground,
    "@media (min-width: 768px)": {
      fontSize: "3rem",
    },
    "@media (min-width: 1024px)": {
      fontSize: "3.75rem",
    },
  },
  subline: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 500,
    textWrap: "balance",
    color: colors.mutedForeground,
    "@media (min-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
  body: {
    fontSize: "1.125rem",
    lineHeight: 1.625,
    textWrap: "pretty",
    color: colors.mutedForeground,
    "@media (min-width: 768px)": {
      fontSize: "1.25rem",
    },
  },
  footnote: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    paddingTop: "1rem",
    fontSize: "0.875rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
  },
  footnoteDot: {
    display: "inline-block",
    width: "0.25rem",
    height: "0.25rem",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
  },
  quote: {
    borderLeftWidth: 4,
    borderLeftStyle: "solid",
    borderLeftColor: colors.accent,
    paddingLeft: "1.5rem",
    fontSize: "1.25rem",
    fontStyle: "italic",
    color: colors.mutedForeground,
    "@media (min-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

/**
 * SlideHeadline is the primary text element for slides.
 * Large, bold, and designed for readability at presentation distance.
 */
export function SlideHeadline({
  children,
  className,
  multiline = false,
}: SlideHeadlineProps) {
  const content =
    multiline && typeof children === "string"
      ? children.split("\n").map((line, i, arr) => {
          const lineKey = line || `empty-line`;
          return (
            <span key={`${lineKey}-${line.length}`}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          );
        })
      : children;

  return (
    <h1 {...mergeSx(stylex.props(styles.headline), className)}>{content}</h1>
  );
}

interface SlideSublineProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideSubline is for subtitles and taglines.
 * Smaller than headline, muted color.
 */
export function SlideSubline({ children, className }: SlideSublineProps) {
  return (
    <p {...mergeSx(stylex.props(styles.subline), className)}>{children}</p>
  );
}

interface SlideBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideBody is for supporting paragraphs (1-3 sentences).
 * Readable at presentation distance with relaxed line height.
 */
export function SlideBody({ children, className }: SlideBodyProps) {
  return <p {...mergeSx(stylex.props(styles.body), className)}>{children}</p>;
}

interface SlideFootnoteProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideFootnote is for small text at the bottom of slides.
 * Citations, attributions, or supplementary info.
 */
export function SlideFootnote({ children, className }: SlideFootnoteProps) {
  return (
    <p {...mergeSx(stylex.props(styles.footnote), className)}>
      <span {...stylex.props(styles.footnoteDot)} />
      {children}
    </p>
  );
}

interface SlideQuoteProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideQuote is for pull quotes within slides.
 * Italicized, smaller than headline.
 */
export function SlideQuote({ children, className }: SlideQuoteProps) {
  return (
    <blockquote {...mergeSx(stylex.props(styles.quote), className)}>
      {children}
    </blockquote>
  );
}
