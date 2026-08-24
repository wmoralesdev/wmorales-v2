"use client";

import * as stylex from "@stylexjs/stylex";
import { Clock, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityRecord } from "@/lib/activities";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface ActivityDetailPopoverProps {
  activities: ActivityRecord[];
  date: Date;
  onClose: () => void;
}

const styles = stylex.create({
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 20%)`,
    backdropFilter: "blur(4px)",
    "@media (min-width: 768px)": {
      alignItems: "center",
    },
  },
  card: {
    margin: "1rem",
    width: "100%",
    maxWidth: "32rem",
    boxShadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
  },
  count: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  close: {
    borderRadius: radii.md,
    padding: "0.25rem",
    color: colors.mutedForeground,
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: colors.muted,
      color: colors.foreground,
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    color: colors.foreground,
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
      color: colors.accent,
    },
  },
  itemTitle: {
    fontWeight: 500,
    color: "inherit",
    transitionProperty: "color",
    transitionDuration: "150ms",
  },
  itemDescription: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    lineHeight: 1.625,
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
  badge: {
    gap: "0.25rem",
    fontSize: "0.75rem",
  },
  badgeIcon: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
});

export function ActivityDetailPopover({
  activities,
  date,
  onClose,
}: ActivityDetailPopoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityRecord | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Focus the close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  const handleActivityClick = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setDetailsDialogOpen(true);
  };

  if (activities.length === 0) return null;

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Activities for ${formattedDate}`}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      {...stylex.props(styles.overlay)}
    >
      <Card className={stylex.props(styles.card).className}>
        <CardHeader>
          <div {...stylex.props(styles.headerRow)}>
            <div {...stylex.props(styles.headerText)}>
              <CardTitle className={stylex.props(styles.cardTitle).className}>
                {formattedDate}
              </CardTitle>
              <p {...stylex.props(styles.count)}>
                {activities.length} activit
                {activities.length === 1 ? "y" : "ies"}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              {...stylex.props(styles.close)}
            >
              <X {...stylex.props(icon.md)} />
            </button>
          </div>
        </CardHeader>
        <CardContent className={stylex.props(styles.content).className}>
          {activities.map((activity) => {
            const displayText =
              activity.shortDescription || activity.description;

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => handleActivityClick(activity)}
                {...stylex.props(styles.item)}
              >
                <p {...stylex.props(styles.itemTitle)}>{activity.title}</p>
                {displayText && (
                  <p {...stylex.props(styles.itemDescription)}>{displayText}</p>
                )}
                <div {...stylex.props(styles.meta)}>
                  {activity.time && (
                    <Badge
                      variant="secondary"
                      className={stylex.props(styles.badge).className}
                    >
                      <Clock {...stylex.props(styles.badgeIcon)} />
                      {activity.time}
                    </Badge>
                  )}
                  {activity.location && (
                    <Badge
                      variant="outline"
                      className={stylex.props(styles.badge).className}
                    >
                      <MapPin {...stylex.props(styles.badgeIcon)} />
                      {activity.location}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
      <ActivityDetailsDialog
        activity={selectedActivity}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}
