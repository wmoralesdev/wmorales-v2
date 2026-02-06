"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ActivityRecord } from "@/lib/activities";
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
        return (
          d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month
        );
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
    <div className="relative">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="min-w-[140px] text-center font-display text-base font-semibold">
            {monthLabel}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        {!isCurrentMonth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="gap-1.5"
          >
            <CalendarDays className="size-3.5" />
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
          <div className="mb-1 grid grid-cols-7 gap-px">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="p-1.5 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border/50">
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
