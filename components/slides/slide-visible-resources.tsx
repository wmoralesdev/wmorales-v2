import {
  CalendarRange,
  ExternalLink,
  Images,
  Link2,
  MessageCircleMore,
} from "lucide-react";
import type { SlideVisibleResource } from "@/lib/slides/schema";
import { cn } from "@/lib/utils";

interface SlideVisibleResourcesProps {
  resources: SlideVisibleResource[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const iconMap = {
  default: Link2,
  event: CalendarRange,
  photos: Images,
  community: MessageCircleMore,
} as const;

/**
 * SlideVisibleResources renders important links directly inside slides.
 */
export function SlideVisibleResources({
  resources,
  title,
  className,
  compact = false,
}: SlideVisibleResourcesProps) {
  if (resources.length === 0) return null;

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      {title ? (
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.18em] text-muted-foreground",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          {title}
        </p>
      ) : null}

      <div className={cn("flex flex-wrap", compact ? "gap-2" : "gap-2.5")}>
        {resources.map((resource) => {
          const Icon = iconMap[resource.kind ?? "default"] ?? Link2;

          return (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group inline-flex max-w-full items-center rounded-full border border-border/70 bg-background/60 text-foreground/90 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent",
                compact
                  ? "gap-1.5 px-2.5 py-1.5 text-[11px]"
                  : "gap-2 px-3 py-2 text-xs md:text-sm",
              )}
            >
              <Icon className={cn("shrink-0", compact ? "size-3" : "size-3.5")} />
              <span className="truncate">{resource.label}</span>
              <ExternalLink
                className={cn(
                  "shrink-0 opacity-60 group-hover:opacity-100",
                  compact ? "size-2.5" : "size-3",
                )}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
