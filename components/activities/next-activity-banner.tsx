"use client";

import * as stylex from "@stylexjs/stylex";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import type { ActivityRecord } from "@/lib/activities";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

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

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  heading: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontWeight: 400,
    textTransform: "uppercase",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: colors.mutedForeground,
  },
  emptyText: {
    fontSize: "0.875rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    width: "100%",
    cursor: "pointer",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingBlock: "1rem",
    textAlign: "left",
    borderRadius: radii.sm,
    color: colors.foreground,
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    ":first-child": {
      borderTopWidth: 0,
      paddingTop: 0,
    },
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
      color: colors.accent,
    },
  },
  itemBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  itemRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    "@media (min-width: 640px)": {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
  },
  itemTitle: {
    fontFamily: fonts.display,
    fontSize: "1rem",
    fontWeight: 500,
    color: "inherit",
    transitionProperty: "color",
    transitionDuration: "150ms",
  },
  itemTime: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontVariantNumeric: "tabular-nums",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 50%)`,
    "@media (min-width: 640px)": {
      flexShrink: 0,
    },
  },
  itemDescription: {
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
    textWrap: "pretty",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.5rem",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  metaIcon: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
});

export function NextActivityBanner({ activities }: NextActivityBannerProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (activities.length === 0) {
    return (
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Next Activities</h2>
        <div {...stylex.props(styles.empty)}>
          <CalendarDays {...stylex.props(icon.md)} />
          <p {...stylex.props(styles.emptyText)}>
            No upcoming activities scheduled.
          </p>
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
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Next Activities</h2>
        <div {...stylex.props(styles.list)}>
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
                {...stylex.props(styles.item)}
              >
                <div {...stylex.props(styles.itemBody)}>
                  <div {...stylex.props(styles.itemRow)}>
                    <h3 {...stylex.props(styles.itemTitle)}>
                      {activity.title}
                    </h3>
                    <time {...stylex.props(styles.itemTime)}>{shortDate}</time>
                  </div>
                  {displayText && (
                    <p {...stylex.props(styles.itemDescription)}>
                      {displayText}
                    </p>
                  )}
                  {(activity.location || activity.time) && (
                    <div {...stylex.props(styles.meta)}>
                      {activity.time && (
                        <div {...stylex.props(styles.metaItem)}>
                          <Clock {...stylex.props(styles.metaIcon)} />
                          {activity.time}
                        </div>
                      )}
                      {activity.location && (
                        <div {...stylex.props(styles.metaItem)}>
                          <MapPin {...stylex.props(styles.metaIcon)} />
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
