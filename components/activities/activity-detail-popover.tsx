"use client";

import { Clock, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityRecord } from "@/lib/activities";

interface ActivityDetailPopoverProps {
  activities: ActivityRecord[];
  date: Date;
  onClose: () => void;
}

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
      className="absolute inset-0 z-10 flex items-start justify-center bg-background/80 backdrop-blur-sm md:items-center"
    >
      <Card className="m-4 w-full max-w-lg shadow-xl">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="font-display text-lg font-semibold">
              {formattedDate}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {activities.length} activit
              {activities.length === 1 ? "y" : "ies"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => {
            const displayText =
              activity.shortDescription || activity.description;

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => handleActivityClick(activity)}
                className="group w-full cursor-pointer rounded-lg border border-border/50 bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50 space-y-2"
              >
                <p className="font-medium text-foreground transition-colors group-hover:text-accent">
                  {activity.title}
                </p>
                {displayText && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {displayText}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {activity.time && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Clock className="size-3" />
                      {activity.time}
                    </Badge>
                  )}
                  {activity.location && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <MapPin className="size-3" />
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
