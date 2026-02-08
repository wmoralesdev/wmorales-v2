"use client";

import { Clock, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import { Badge } from "@/components/ui/badge";
import type { ActivityRecord } from "@/lib/activities";
import { cn } from "@/lib/utils";

interface ActivityAgendaProps {
  activities: ActivityRecord[];
  year: number;
  month: number;
}

type GroupedActivities = {
  date: Date;
  dayLabel: string;
  items: ActivityRecord[];
};

function groupByDate(activities: ActivityRecord[]): GroupedActivities[] {
  const groups = new Map<string, ActivityRecord[]>();

  for (const activity of activities) {
    // Use UTC date string (YYYY-MM-DD) as key to avoid timezone shifts
    const d = new Date(activity.date);
    const key = d.toISOString().split("T")[0];
    const existing = groups.get(key);
    if (existing) {
      existing.push(activity);
    } else {
      groups.set(key, [activity]);
    }
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    // Parse the UTC date string and format in UTC to display correct date
    const date = new Date(key + "T00:00:00.000Z");
    return {
      date,
      dayLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(date),
      items,
    };
  });
}

export function ActivityAgenda({
  activities,
  year,
  month,
}: ActivityAgendaProps) {
  const todayRef = useRef<HTMLDivElement>(null);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month - 1;
  // Use local date for "today" comparison (user's calendar date)
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const grouped = groupByDate(activities);

  const handleActivityClick = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (isCurrentMonth && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isCurrentMonth]);

  if (grouped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No activities this month
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Check other months for upcoming events.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {grouped.map((group) => {
          // Use UTC date string for comparison with activity dates
          const groupKey = group.date.toISOString().split("T")[0];
          // Compare with local today key (user's calendar date)
          const isToday = groupKey === todayKey;

          return (
            <div
              key={groupKey}
              ref={isToday ? todayRef : undefined}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "text-sm font-semibold",
                    isToday ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {group.dayLabel}
                </h3>
                {isToday && (
                  <Badge variant="secondary" className="text-[10px]">
                    Today
                  </Badge>
                )}
              </div>

              <div className="space-y-2 border-l-2 border-border pl-4">
                {group.items.map((activity) => {
                  const displayText =
                    activity.shortDescription || activity.description;

                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => handleActivityClick(activity)}
                      className="group w-full cursor-pointer rounded-lg border border-border/50 bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground transition-colors group-hover:text-accent">
                          {activity.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {activity.time && (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[10px]"
                            >
                              <Clock className="size-2.5" />
                              {activity.time}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {activity.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {activity.location}
                        </div>
                      )}

                      {displayText && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {displayText}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <ActivityDetailsDialog
        activity={selectedActivity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
