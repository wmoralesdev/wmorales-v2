"use client";

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold">
            {activity.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-1">
            <CalendarDays className="size-4 shrink-0" />
            {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time and Location */}
          {(activity.time || activity.location) && (
            <div className="flex flex-wrap items-center gap-3">
              {activity.time && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4 shrink-0" />
                  {activity.time}
                </div>
              )}
              {activity.location && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {activity.location}
                </div>
              )}
            </div>
          )}

          {/* Short Description */}
          {activity.shortDescription && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {activity.shortDescription}
              </p>
            </div>
          )}

          {/* Full Description */}
          {activity.description && (
            <div className="space-y-1">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {activity.description}
              </p>
            </div>
          )}

          {/* Luma URL CTA */}
          {activity.lumaUrl && (
            <div className="pt-2">
              {isPastEvent ? (
                <Button disabled className="w-full sm:w-auto">
                  Event has ended
                </Button>
              ) : (
                <Button asChild className="w-full sm:w-auto">
                  <Link
                    href={activity.lumaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    RSVP on Luma
                    <ExternalLink className="size-4" />
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
