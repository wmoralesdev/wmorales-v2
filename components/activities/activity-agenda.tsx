"use client";

import * as stylex from "@stylexjs/stylex";
import { Clock, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import { Badge } from "@/components/ui/badge";
import type { ActivityRecord } from "@/lib/activities";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

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
    const date = new Date(`${key}T00:00:00.000Z`);
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

const styles = stylex.create({
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "4rem",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: "1.125rem",
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  emptyHint: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  groupHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  dayLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  dayLabelToday: {
    color: colors.accent,
  },
  dayLabelMuted: {
    color: colors.mutedForeground,
  },
  todayBadge: {
    fontSize: "10px",
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: colors.border,
    paddingLeft: "1rem",
  },
  item: {
    width: "100%",
    cursor: "pointer",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
    padding: "0.75rem",
    textAlign: "left",
    color: colors.foreground,
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
      color: colors.accent,
    },
  },
  itemHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  itemTitle: {
    fontWeight: 500,
    color: "inherit",
    transitionProperty: "color",
    transitionDuration: "150ms",
  },
  itemMeta: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: "0.375rem",
  },
  timeBadge: {
    gap: "0.25rem",
    fontSize: "10px",
  },
  timeIcon: {
    width: "0.625rem",
    height: "0.625rem",
    flexShrink: 0,
  },
  location: {
    marginTop: "0.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  locationIcon: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
  itemDescription: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    lineHeight: 1.625,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
});

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
      <div {...stylex.props(styles.empty)}>
        <p {...stylex.props(styles.emptyTitle)}>No activities this month</p>
        <p {...stylex.props(styles.emptyHint)}>
          Check other months for upcoming events.
        </p>
      </div>
    );
  }

  return (
    <>
      <div {...stylex.props(styles.list)}>
        {grouped.map((group) => {
          // Use UTC date string for comparison with activity dates
          const groupKey = group.date.toISOString().split("T")[0];
          // Compare with local today key (user's calendar date)
          const isToday = groupKey === todayKey;

          return (
            <div
              key={groupKey}
              ref={isToday ? todayRef : undefined}
              {...stylex.props(styles.group)}
            >
              <div {...stylex.props(styles.groupHeader)}>
                <h3
                  {...stylex.props(
                    styles.dayLabel,
                    isToday ? styles.dayLabelToday : styles.dayLabelMuted,
                  )}
                >
                  {group.dayLabel}
                </h3>
                {isToday && (
                  <Badge
                    variant="secondary"
                    className={stylex.props(styles.todayBadge).className}
                  >
                    Today
                  </Badge>
                )}
              </div>

              <div {...stylex.props(styles.items)}>
                {group.items.map((activity) => {
                  const displayText =
                    activity.shortDescription || activity.description;

                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => handleActivityClick(activity)}
                      {...stylex.props(styles.item)}
                    >
                      <div {...stylex.props(styles.itemHeader)}>
                        <p {...stylex.props(styles.itemTitle)}>
                          {activity.title}
                        </p>
                        <div {...stylex.props(styles.itemMeta)}>
                          {activity.time && (
                            <Badge
                              variant="secondary"
                              className={
                                stylex.props(styles.timeBadge).className
                              }
                            >
                              <Clock {...stylex.props(styles.timeIcon)} />
                              {activity.time}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {activity.location && (
                        <div {...stylex.props(styles.location)}>
                          <MapPin {...stylex.props(styles.locationIcon)} />
                          {activity.location}
                        </div>
                      )}

                      {displayText && (
                        <p {...stylex.props(styles.itemDescription)}>
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
