"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    width: "fit-content",
    backgroundColor: colors.background,
    padding: "0.75rem",
  },
  months: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  month: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: "1rem",
  },
  nav: {
    position: "absolute",
    insetInline: 0,
    top: 0,
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.25rem",
  },
  navButton: {
    width: "var(--cell-size)",
    height: "var(--cell-size)",
    userSelect: "none",
    padding: 0,
    ":is([aria-disabled=true])": {
      opacity: 0.5,
    },
  },
  monthCaption: {
    display: "flex",
    height: "var(--cell-size)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "var(--cell-size)",
  },
  dropdowns: {
    display: "flex",
    height: "var(--cell-size)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  dropdownRoot: {
    position: "relative",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
  },
  dropdown: {
    position: "absolute",
    inset: 0,
    opacity: 0,
  },
  captionLabel: {
    userSelect: "none",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  captionLabelDropdown: {
    display: "flex",
    height: "2rem",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: radii.md,
    paddingRight: "0.25rem",
    paddingLeft: "0.5rem",
    fontSize: "0.875rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  weekdays: {
    display: "flex",
  },
  weekday: {
    flex: 1,
    userSelect: "none",
    borderRadius: radii.md,
    fontWeight: 400,
    fontSize: "0.8rem",
    color: colors.mutedForeground,
  },
  week: {
    marginTop: "0.5rem",
    display: "flex",
    width: "100%",
  },
  weekNumberHeader: {
    width: "var(--cell-size)",
    userSelect: "none",
  },
  weekNumber: {
    userSelect: "none",
    fontSize: "0.8rem",
    color: colors.mutedForeground,
  },
  weekNumberCell: {
    display: "flex",
    width: "var(--cell-size)",
    height: "var(--cell-size)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  day: {
    position: "relative",
    aspectRatio: "1 / 1",
    height: "100%",
    width: "100%",
    userSelect: "none",
    padding: 0,
    textAlign: "center",
  },
  rangeStart: {
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
    backgroundColor: colors.accent,
  },
  rangeMiddle: {
    borderRadius: 0,
  },
  rangeEnd: {
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
    backgroundColor: colors.accent,
  },
  today: {
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  outside: {
    color: colors.mutedForeground,
  },
  disabled: {
    color: colors.mutedForeground,
    opacity: 0.5,
  },
  hidden: {
    visibility: "hidden",
  },
  chevron: {
    width: "1rem",
    height: "1rem",
  },
  dayButton: {
    display: "flex",
    aspectRatio: "1 / 1",
    width: "100%",
    minWidth: "var(--cell-size)",
    flexDirection: "column",
    gap: "0.25rem",
    fontWeight: 400,
    lineHeight: 1,
    ":is([data-selected-single=true])": {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
    ":is([data-range-start=true])": {
      borderRadius: radii.md,
      borderTopLeftRadius: radii.md,
      borderBottomLeftRadius: radii.md,
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
    ":is([data-range-end=true])": {
      borderRadius: radii.md,
      borderTopRightRadius: radii.md,
      borderBottomRightRadius: radii.md,
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
    ":is([data-range-middle=true])": {
      borderRadius: 0,
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
});

function CalendarDayButton({
  className,
  day,
  modifiers,
  style,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...mergeSx(
        stylex.props(styles.dayButton),
        [defaultClassNames.day, className].filter(Boolean).join(" "),
        style,
      )}
      {...props}
    />
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  style,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      classNames={{
        root: mergeSx(
          stylex.props(styles.root),
          defaultClassNames.root,
        ).className,
        months: mergeSx(
          stylex.props(styles.months),
          defaultClassNames.months,
        ).className,
        month: mergeSx(
          stylex.props(styles.month),
          defaultClassNames.month,
        ).className,
        nav: mergeSx(stylex.props(styles.nav), defaultClassNames.nav).className,
        button_previous: mergeSx(
          {
            className: buttonVariants({ variant: buttonVariant }),
          },
          mergeSx(stylex.props(styles.navButton), defaultClassNames.button_previous)
            .className,
        ).className,
        button_next: mergeSx(
          {
            className: buttonVariants({ variant: buttonVariant }),
          },
          mergeSx(stylex.props(styles.navButton), defaultClassNames.button_next)
            .className,
        ).className,
        month_caption: mergeSx(
          stylex.props(styles.monthCaption),
          defaultClassNames.month_caption,
        ).className,
        dropdowns: mergeSx(
          stylex.props(styles.dropdowns),
          defaultClassNames.dropdowns,
        ).className,
        dropdown_root: mergeSx(
          stylex.props(styles.dropdownRoot),
          defaultClassNames.dropdown_root,
        ).className,
        dropdown: mergeSx(
          stylex.props(styles.dropdown),
          defaultClassNames.dropdown,
        ).className,
        caption_label: mergeSx(
          stylex.props(
            styles.captionLabel,
            captionLayout !== "label" && styles.captionLabelDropdown,
          ),
          defaultClassNames.caption_label,
        ).className,
        table: mergeSx(stylex.props(styles.table)).className,
        weekdays: mergeSx(
          stylex.props(styles.weekdays),
          defaultClassNames.weekdays,
        ).className,
        weekday: mergeSx(
          stylex.props(styles.weekday),
          defaultClassNames.weekday,
        ).className,
        week: mergeSx(
          stylex.props(styles.week),
          defaultClassNames.week,
        ).className,
        week_number_header: mergeSx(
          stylex.props(styles.weekNumberHeader),
          defaultClassNames.week_number_header,
        ).className,
        week_number: mergeSx(
          stylex.props(styles.weekNumber),
          defaultClassNames.week_number,
        ).className,
        day: mergeSx(stylex.props(styles.day), defaultClassNames.day).className,
        range_start: mergeSx(
          stylex.props(styles.rangeStart),
          defaultClassNames.range_start,
        ).className,
        range_middle: mergeSx(
          stylex.props(styles.rangeMiddle),
          defaultClassNames.range_middle,
        ).className,
        range_end: mergeSx(
          stylex.props(styles.rangeEnd),
          defaultClassNames.range_end,
        ).className,
        today: mergeSx(
          stylex.props(styles.today),
          defaultClassNames.today,
        ).className,
        outside: mergeSx(
          stylex.props(styles.outside),
          defaultClassNames.outside,
        ).className,
        disabled: mergeSx(
          stylex.props(styles.disabled),
          defaultClassNames.disabled,
        ).className,
        hidden: mergeSx(
          stylex.props(styles.hidden),
          defaultClassNames.hidden,
        ).className,
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              {...mergeSx({}, rootClassName)}
              {...rootProps}
            />
          );
        },
        Chevron: ({
          className: chevronClassName,
          orientation,
          ...chevronProps
        }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                {...mergeSx(stylex.props(styles.chevron), chevronClassName)}
                {...chevronProps}
              />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                {...mergeSx(stylex.props(styles.chevron), chevronClassName)}
                {...chevronProps}
              />
            );
          }

          return (
            <ChevronDownIcon
              {...mergeSx(stylex.props(styles.chevron), chevronClassName)}
              {...chevronProps}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekNumberProps }) => {
          return (
            <td {...weekNumberProps}>
              <div {...stylex.props(styles.weekNumberCell)}>{children}</div>
            </td>
          );
        },
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      style={
        {
          "--cell-size": "2rem",
          ...style,
        } as React.CSSProperties
      }
      {...mergeSx(stylex.props(styles.root), className)}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
