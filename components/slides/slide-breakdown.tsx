import { cn } from "@/lib/utils";

interface BreakdownItem {
  label: string;
  value: number;
}

interface SlideBreakdownProps {
  items: BreakdownItem[];
  className?: string;
  /**
   * Display variant for the breakdown.
   * - "bars": Horizontal progress bars (default)
   * - "stats": Large stat cards
   */
  variant?: "bars" | "stats";
}

/**
 * SlideBreakdown renders percentage/value breakdowns.
 * Avoids recharts for PDF compatibility - uses pure CSS.
 */
export function SlideBreakdown({
  items,
  className,
  variant = "bars",
}: SlideBreakdownProps) {
  if (variant === "stats") {
    return (
      <div
        className={cn(
          "grid gap-6",
          items.length === 2 && "grid-cols-2",
          items.length === 3 && "grid-cols-3",
          items.length >= 4 && "grid-cols-2 md:grid-cols-4",
          className,
        )}
      >
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="relative flex flex-col items-center overflow-hidden rounded-lg border border-border bg-muted/30 p-6"
          >
            {/* Accent gradient at top */}
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <span className="font-display text-4xl font-bold tabular-nums text-accent md:text-5xl">
              {item.value}%
            </span>
            <span className="mt-2 text-center text-sm text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Default: horizontal bars
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {item.value}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
