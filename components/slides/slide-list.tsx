import { cn } from "@/lib/utils";

interface SlideListProps {
  items: string[];
  className?: string;
  /**
   * Whether to show numbered items instead of bullets.
   */
  numbered?: boolean;
}

/**
 * SlideList renders bullet points or numbered lists for slides.
 * Max 5 items recommended for readability.
 */
export function SlideList({
  items,
  className,
  numbered = false,
}: SlideListProps) {
  const ListTag = numbered ? "ol" : "ul";

  return (
    <ListTag
      className={cn(
        "space-y-4 text-lg md:text-xl",
        numbered ? "list-decimal pl-6" : "list-none",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          {!numbered && (
            <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
          )}
          <span className="text-pretty text-foreground">{item}</span>
        </li>
      ))}
    </ListTag>
  );
}

interface SlideNumberedStepsProps {
  steps: string[];
  className?: string;
}

/**
 * SlideNumberedSteps renders numbered steps with emphasis.
 * Used for CTA slides and action items.
 */
export function SlideNumberedSteps({
  steps,
  className,
}: SlideNumberedStepsProps) {
  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <li key={step} className="flex items-start gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20">
            {index + 1}
          </span>
          <span className="pt-1.5 text-lg text-pretty text-foreground md:text-xl">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
