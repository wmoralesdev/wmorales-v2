"use client";

import type { ActivityRecord } from "@/lib/activities";
import { cn } from "@/lib/utils";

interface ActivityDayCellProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  activities: ActivityRecord[];
  onSelect: (day: number) => void;
  isSelected: boolean;
}

export function ActivityDayCell({
  day,
  isCurrentMonth,
  isToday,
  activities,
  onSelect,
  isSelected,
}: ActivityDayCellProps) {
  const hasActivities = activities.length > 0 && isCurrentMonth;

  const classes = cn(
    "relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-md border border-transparent text-sm transition-colors",
    isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
    hasActivities && "cursor-pointer hover:bg-muted/50",
    isToday && "border-accent/50 bg-accent/5",
    isSelected && "border-accent bg-accent/10",
  );

  const content = (
    <>
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-xs font-medium",
          isToday && "bg-accent text-accent-foreground",
        )}
      >
        {day}
      </span>
      {hasActivities && (
        <div className="flex gap-0.5">
          {activities.slice(0, 3).map((a) => (
            <span
              key={a.id}
              className="block size-1 rounded-full bg-accent"
              title={a.title}
            />
          ))}
          {activities.length > 3 && (
            <span className="text-[8px] leading-none text-muted-foreground">
              +{activities.length - 3}
            </span>
          )}
        </div>
      )}
    </>
  );

  if (!hasActivities) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <button type="button" onClick={() => onSelect(day)} className={classes}>
      {content}
    </button>
  );
}
