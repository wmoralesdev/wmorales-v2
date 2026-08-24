"use client";

import * as stylex from "@stylexjs/stylex";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ActivityRecord } from "@/lib/activities";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";
import { ActivityAgenda } from "./activity-agenda";
import { ActivityDayCell } from "./activity-day-cell";
import { ActivityDetailPopover } from "./activity-detail-popover";

interface ActivityCalendarProps {
  activities: ActivityRecord[];
  initialYear: number;
  initialMonth: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

const styles = stylex.create({
  root: {
    position: "relative",
  },
  nav: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navControls: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  monthLabel: {
    minWidth: "140px",
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: "1rem",
    fontWeight: 600,
  },
  weekdays: {
    marginBottom: "0.25rem",
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "1px",
  },
  weekday: {
    padding: "0.375rem",
    textAlign: "center",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "1px",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
  },
});

export function ActivityCalendar({
  activities,
  initialYear,
  initialMonth,
}: ActivityCalendarProps) {
  const isMobile = useIsMobile();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const monthLabel = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPrev = useCallback(() => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }, [month]);

  const goToNext = useCallback(() => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }, [month]);

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;

  const goToToday = useCallback(() => {
    setYear(todayYear);
    setMonth(todayMonth);
    setSelectedDay(null);
  }, [todayYear, todayMonth]);

  // Filter activities for current month view
  // Use UTC date parts to avoid timezone shifts (activities are date-only)
  const monthActivities = useMemo(
    () =>
      activities.filter((a) => {
        const d = new Date(a.date);
        return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
      }),
    [activities, year, month],
  );

  // Group activities by day number using UTC date parts
  const activitiesByDay = useMemo(() => {
    const map = new Map<number, ActivityRecord[]>();
    for (const a of monthActivities) {
      const day = new Date(a.date).getUTCDate();
      const existing = map.get(day);
      if (existing) {
        existing.push(a);
      } else {
        map.set(day, [a]);
      }
    }
    return map;
  }, [monthActivities]);

  // Calendar grid data
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(
    month === 1 ? year - 1 : year,
    month === 1 ? 12 : month - 1,
  );

  const selectedActivities = selectedDay
    ? (activitiesByDay.get(selectedDay) ?? [])
    : [];

  return (
    <div {...stylex.props(styles.root)}>
      {/* Month navigation */}
      <div {...stylex.props(styles.nav)}>
        <div {...stylex.props(styles.navControls)}>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            aria-label="Previous month"
          >
            <ChevronLeft {...stylex.props(icon.md)} />
          </Button>
          <h2 {...stylex.props(styles.monthLabel)}>{monthLabel}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next month"
          >
            <ChevronRight {...stylex.props(icon.md)} />
          </Button>
        </div>
        {!isCurrentMonth && (
          <Button variant="ghost" size="sm" onClick={goToToday}>
            <CalendarDays {...stylex.props(icon.sm)} />
            Today
          </Button>
        )}
      </div>

      {/* Calendar content */}
      {isMobile ? (
        <ActivityAgenda
          activities={monthActivities}
          year={year}
          month={month}
        />
      ) : (
        <>
          {/* Weekday headers */}
          <div {...stylex.props(styles.weekdays)}>
            {WEEKDAYS.map((day) => (
              <div key={day} {...stylex.props(styles.weekday)}>
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div {...stylex.props(styles.grid)}>
            {/* Previous month trailing days */}
            {Array.from({ length: firstDay }, (_, i) => {
              const day = prevMonthDays - firstDay + i + 1;
              return (
                <ActivityDayCell
                  key={`prev-${day}`}
                  day={day}
                  isCurrentMonth={false}
                  isToday={false}
                  activities={[]}
                  onSelect={() => {}}
                  isSelected={false}
                />
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayIsToday = isCurrentMonth && today.getDate() === day;
              return (
                <ActivityDayCell
                  key={`cur-${day}`}
                  day={day}
                  isCurrentMonth
                  isToday={dayIsToday}
                  activities={activitiesByDay.get(day) ?? []}
                  onSelect={setSelectedDay}
                  isSelected={selectedDay === day}
                />
              );
            })}

            {/* Next month leading days */}
            {(() => {
              const totalCells = firstDay + daysInMonth;
              const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
              return Array.from({ length: remaining }, (_, i) => (
                <ActivityDayCell
                  key={`next-${i + 1}`}
                  day={i + 1}
                  isCurrentMonth={false}
                  isToday={false}
                  activities={[]}
                  onSelect={() => {}}
                  isSelected={false}
                />
              ));
            })()}
          </div>
        </>
      )}

      {/* Detail overlay */}
      {selectedDay !== null && selectedActivities.length > 0 && (
        <ActivityDetailPopover
          activities={selectedActivities}
          date={new Date(year, month - 1, selectedDay)}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
