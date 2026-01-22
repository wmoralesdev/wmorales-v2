import { cn } from "@/lib/utils";

interface ColumnContent {
  title: string;
  items: string[];
}

interface SlideTwoColumnProps {
  left: ColumnContent;
  right: ColumnContent;
  className?: string;
}

/**
 * SlideTwoColumn renders side-by-side content comparison or grouping.
 * Equal width columns with visual separator.
 */
export function SlideTwoColumn({
  left,
  right,
  className,
}: SlideTwoColumnProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-8 md:gap-12", className)}>
      <SlideColumn {...left} />
      <SlideColumn {...right} side="right" />
    </div>
  );
}

interface SlideColumnProps extends ColumnContent {
  side?: "left" | "right";
}

function SlideColumn({ title, items, side = "left" }: SlideColumnProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        side === "right" && "border-l border-accent/30 pl-8 md:pl-12",
      )}
    >
      <div className="space-y-2">
        <div className="h-0.5 w-8 bg-accent" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-pretty text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
