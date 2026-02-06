"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import type { ActivityRecord } from "@/lib/activities";

interface NextActivityBannerProps {
  activities: ActivityRecord[];
}

/**
 * Format a short date for display in the meta section (right-aligned).
 * Uses UTC timezone to avoid day shifts (activities are date-only).
 */
function formatActivityDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function NextActivityBanner({ activities }: NextActivityBannerProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (activities.length === 0) {
    return (
      <section className="space-y-5">
        <h2 className="font-mono text-xs font-normal uppercase text-muted-foreground/60">
          Next Activities
        </h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <p className="text-sm">No upcoming activities scheduled.</p>
        </div>
      </section>
    );
  }

  const handleActivityClick = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  return (
    <>
      <section className="space-y-5">
        <h2 className="font-mono text-xs font-normal uppercase text-muted-foreground/60">
          Next Activities
        </h2>
        <div className="space-y-0">
          {activities.map((activity) => {
            const activityDate = new Date(activity.date);
            const shortDate = formatActivityDateShort(activityDate);

            // Show short description if available, otherwise fallback to description if different from title
            const displayText =
              activity.shortDescription ||
              (activity.description &&
              activity.description.trim() !== activity.title.trim()
                ? activity.description
                : null);

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => handleActivityClick(activity)}
                className="group w-full cursor-pointer border-t border-border/60 py-4 text-left first:border-t-0 first:pt-0 transition-colors hover:bg-muted/30 rounded-sm"
              >
                <div className="block space-y-1.5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-display text-base font-medium text-foreground transition-colors group-hover:text-accent">
                      {activity.title}
                    </h3>
                    <time className="font-mono text-xs tabular-nums text-muted-foreground/50 sm:shrink-0">
                      {shortDate}
                    </time>
                  </div>
                  {displayText && (
                    <p className="text-sm leading-relaxed text-muted-foreground/70 text-pretty line-clamp-2">
                      {displayText}
                    </p>
                  )}
                  {(activity.location || activity.time) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {activity.time && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                          <Clock className="size-3" />
                          {activity.time}
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                          <MapPin className="size-3" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <ActivityDetailsDialog
        activity={selectedActivity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
