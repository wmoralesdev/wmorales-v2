"use client";

import * as stylex from "@stylexjs/stylex";
import type { ActivityRecord } from "@/lib/activities";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

interface ActivityDayCellProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  activities: ActivityRecord[];
  onSelect: (day: number) => void;
  isSelected: boolean;
}

const styles = stylex.create({
  cell: {
    position: "relative",
    display: "flex",
    height: "3.5rem",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.125rem",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    fontSize: "0.875rem",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
  },
  currentMonth: {
    color: colors.foreground,
  },
  otherMonth: {
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 60%)`,
  },
  clickable: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
    },
  },
  today: {
    borderColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 95%)`,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
  },
  day: {
    display: "flex",
    width: "1.25rem",
    height: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  todayDay: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  dots: {
    display: "flex",
    gap: "0.125rem",
  },
  dot: {
    display: "block",
    width: "0.25rem",
    height: "0.25rem",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
  overflow: {
    fontSize: "8px",
    lineHeight: 1,
    color: colors.mutedForeground,
  },
});

export function ActivityDayCell({
  day,
  isCurrentMonth,
  isToday,
  activities,
  onSelect,
  isSelected,
}: ActivityDayCellProps) {
  const hasActivities = activities.length > 0 && isCurrentMonth;

  const cellProps = stylex.props(
    styles.cell,
    isCurrentMonth ? styles.currentMonth : styles.otherMonth,
    hasActivities && styles.clickable,
    isToday && styles.today,
    isSelected && styles.selected,
  );

  const content = (
    <>
      <span {...stylex.props(styles.day, isToday && styles.todayDay)}>
        {day}
      </span>
      {hasActivities && (
        <div {...stylex.props(styles.dots)}>
          {activities.slice(0, 3).map((a) => (
            <span key={a.id} title={a.title} {...stylex.props(styles.dot)} />
          ))}
          {activities.length > 3 && (
            <span {...stylex.props(styles.overflow)}>
              +{activities.length - 3}
            </span>
          )}
        </div>
      )}
    </>
  );

  if (!hasActivities) {
    return <div {...cellProps}>{content}</div>;
  }

  return (
    <button type="button" onClick={() => onSelect(day)} {...cellProps}>
      {content}
    </button>
  );
}
