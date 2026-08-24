import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface BreakdownItem {
  label: string;
  value: number;
}

interface SlideBreakdownProps {
  items: BreakdownItem[];
  className?: string;
  /**
   * Display variant for the breakdown.
   * - "bars": Horizontal progress bars (default)
   * - "stats": Large stat cards
   */
  variant?: "bars" | "stats";
}

const styles = stylex.create({
  statsGrid: {
    display: "grid",
    gap: "1.5rem",
  },
  cols2: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  cols3: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  cols4: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  statCard: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
    padding: "1.5rem",
  },
  accentBar: {
    position: "absolute",
    insetInline: 0,
    top: 0,
    height: "0.25rem",
    backgroundColor: colors.accent,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: "2.25rem",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    color: colors.accent,
    "@media (min-width: 768px)": {
      fontSize: "3rem",
    },
  },
  statLabel: {
    marginTop: "0.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  bars: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  barRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  barMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  barValue: {
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
    color: colors.mutedForeground,
  },
  track: {
    height: "0.75rem",
    overflow: "hidden",
    borderRadius: radii.full,
    backgroundColor: colors.muted,
  },
  fill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    transitionProperty: "width",
    transitionDuration: "150ms",
  },
});

/**
 * SlideBreakdown renders percentage/value breakdowns.
 * Avoids recharts for PDF compatibility - uses pure CSS.
 */
export function SlideBreakdown({
  items,
  className,
  variant = "bars",
}: SlideBreakdownProps) {
  if (variant === "stats") {
    return (
      <div
        {...mergeSx(
          stylex.props(
            styles.statsGrid,
            items.length === 2 && styles.cols2,
            items.length === 3 && styles.cols3,
            items.length >= 4 && styles.cols4,
          ),
          className,
        )}
      >
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            {...stylex.props(styles.statCard)}
          >
            <div {...stylex.props(styles.accentBar)} />
            <span {...stylex.props(styles.statValue)}>{item.value}%</span>
            <span {...stylex.props(styles.statLabel)}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div {...mergeSx(stylex.props(styles.bars), className)}>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          {...stylex.props(styles.barRow)}
        >
          <div {...stylex.props(styles.barMeta)}>
            <span {...stylex.props(styles.barLabel)}>{item.label}</span>
            <span {...stylex.props(styles.barValue)}>{item.value}%</span>
          </div>
          <div {...stylex.props(styles.track)}>
            <div
              {...mergeSx(stylex.props(styles.fill), undefined, {
                width: `${Math.min(100, Math.max(0, item.value))}%`,
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
