import { cn } from "@/lib/utils";

interface SlideHeadlineProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Render headline with line breaks from \n in the source.
   */
  multiline?: boolean;
}

/**
 * SlideHeadline is the primary text element for slides.
 * Large, bold, and designed for readability at presentation distance.
 */
export function SlideHeadline({
  children,
  className,
  multiline = false,
}: SlideHeadlineProps) {
  // Handle \n line breaks in headline text
  const content =
    multiline && typeof children === "string"
      ? children.split("\n").map((line, i, arr) => {
          // Use line content as key; for empty lines, use a stable identifier
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
    <h1
      className={cn(
        "font-display text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl",
        className,
      )}
    >
      {content}
    </h1>
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
    <p
      className={cn(
        "font-display text-xl font-medium text-balance text-muted-foreground md:text-2xl",
        className,
      )}
    >
      {children}
    </p>
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
  return (
    <p
      className={cn(
        "text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
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
    <p
      className={cn(
        "mt-auto flex items-center gap-2 pt-4 text-sm text-muted-foreground/70",
        className,
      )}
    >
      <span className="inline-block size-1 rounded-full bg-accent/50" />
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
    <blockquote
      className={cn(
        "border-l-4 border-accent pl-6 text-xl italic text-muted-foreground md:text-2xl",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}
