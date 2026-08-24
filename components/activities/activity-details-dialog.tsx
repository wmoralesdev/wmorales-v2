"use client";

import * as stylex from "@stylexjs/stylex";
import { CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActivityRecord } from "@/lib/activities";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface ActivityDetailsDialogProps {
  activity: ActivityRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Format a date-only activity date using UTC timezone to avoid day shifts.
 */
function formatActivityDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const styles = stylex.create({
  dialog: {
    "@media (min-width: 640px)": {
      maxWidth: "32rem",
    },
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  description: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    paddingTop: "0.25rem",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.75rem",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  shortDescription: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  fullDescription: {
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: colors.mutedForeground,
  },
  cta: {
    paddingTop: "0.5rem",
  },
  ctaButton: {
    width: "100%",
    "@media (min-width: 640px)": {
      width: "auto",
    },
  },
  ctaLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
});

export function ActivityDetailsDialog({
  activity,
  open,
  onOpenChange,
}: ActivityDetailsDialogProps) {
  if (!activity) return null;

  const activityDate = new Date(activity.date);
  const formattedDate = formatActivityDate(activityDate);

  // Check if event is in the past (date-only comparison in UTC)
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);
  const activityDateUTC = new Date(activityDate);
  activityDateUTC.setUTCHours(0, 0, 0, 0);
  const isPastEvent = activityDateUTC < todayUTC;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={stylex.props(styles.dialog).className}>
        <DialogHeader>
          <DialogTitle className={stylex.props(styles.title).className}>
            {activity.title}
          </DialogTitle>
          <DialogDescription
            className={stylex.props(styles.description).className}
          >
            <CalendarDays {...stylex.props(icon.md)} />
            {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div {...stylex.props(styles.stack)}>
          {/* Time and Location */}
          {(activity.time || activity.location) && (
            <div {...stylex.props(styles.meta)}>
              {activity.time && (
                <div {...stylex.props(styles.metaItem)}>
                  <Clock {...stylex.props(icon.md)} />
                  {activity.time}
                </div>
              )}
              {activity.location && (
                <div {...stylex.props(styles.metaItem)}>
                  <MapPin {...stylex.props(icon.md)} />
                  {activity.location}
                </div>
              )}
            </div>
          )}

          {/* Short Description */}
          {activity.shortDescription && (
            <div {...stylex.props(styles.field)}>
              <p {...stylex.props(styles.shortDescription)}>
                {activity.shortDescription}
              </p>
            </div>
          )}

          {/* Full Description */}
          {activity.description && (
            <div {...stylex.props(styles.field)}>
              <p {...stylex.props(styles.fullDescription)}>
                {activity.description}
              </p>
            </div>
          )}

          {/* Luma URL CTA */}
          {activity.lumaUrl && (
            <div {...stylex.props(styles.cta)}>
              {isPastEvent ? (
                <Button
                  disabled
                  className={stylex.props(styles.ctaButton).className}
                >
                  Event has ended
                </Button>
              ) : (
                <Button
                  asChild
                  className={stylex.props(styles.ctaButton).className}
                >
                  <Link
                    href={activity.lumaUrl}
                    target="_blank"
                    rel="noreferrer"
                    {...stylex.props(styles.ctaLink)}
                  >
                    RSVP on Luma
                    <ExternalLink {...stylex.props(icon.md)} />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
