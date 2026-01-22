import { cn } from "@/lib/utils";

interface TimelineEvent {
  title: string;
  description: string;
  metric?: string;
}

interface SlideTimelineProps {
  events: TimelineEvent[];
  className?: string;
  /**
   * Layout direction for the timeline.
   * - "horizontal": Events in a row (default, better for wide slides)
   * - "vertical": Events stacked vertically
   */
  direction?: "horizontal" | "vertical";
}

/**
 * SlideTimeline renders sequential events or milestones.
 * Max 4 events recommended for readability.
 */
export function SlideTimeline({
  events,
  className,
  direction = "horizontal",
}: SlideTimelineProps) {
  if (direction === "vertical") {
    return (
      <div className={cn("space-y-0", className)}>
        {events.map((event, index) => (
          <div
            key={`${event.title}-${event.description}`}
            className="relative flex gap-6 pb-8 last:pb-0"
          >
            {/* Connector line */}
            {index < events.length - 1 && (
              <div className="absolute left-3 top-8 h-full w-px bg-border" />
            )}
            {/* Dot */}
            <div className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent">
              <div className="size-2 rounded-full bg-accent-foreground" />
            </div>
            {/* Content */}
            <div className="flex-1 space-y-1">
              {event.metric && (
                <span className="font-mono text-sm font-medium text-accent">
                  {event.metric}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal layout (default)
  return (
    <div className={cn("flex items-start gap-4", className)}>
      {events.map((event, index) => (
        <div
          key={`${event.title}-${event.description}`}
          className="relative flex flex-1 flex-col items-center"
        >
          {/* Connector line */}
          {index < events.length - 1 && (
            <div className="absolute left-1/2 top-3 h-0.5 w-full bg-accent/30" />
          )}
          {/* Dot */}
          <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/20">
            <div className="size-2.5 rounded-full bg-accent-foreground" />
          </div>
          {/* Content */}
          <div className="mt-4 text-center">
            {event.metric && (
              <span className="inline-block rounded-full bg-accent/20 px-3 py-0.5 font-mono text-xs font-medium text-accent">
                {event.metric}
              </span>
            )}
            <h3 className="mt-2 font-display text-base font-semibold text-foreground">
              {event.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
