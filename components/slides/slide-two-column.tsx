import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface ColumnContent {
  title: string;
  items: string[];
}

interface SlideTwoColumnProps {
  left: ColumnContent;
  right: ColumnContent;
  className?: string;
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "2rem",
    "@media (min-width: 768px)": {
      gap: "3rem",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  right: {
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: `color-mix(in oklch, ${colors.accent}, transparent 70%)`,
    paddingLeft: "2rem",
    "@media (min-width: 768px)": {
      paddingLeft: "3rem",
    },
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  accent: {
    height: "0.125rem",
    width: "2rem",
    backgroundColor: colors.accent,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  dot: {
    marginTop: "0.5rem",
    width: "0.375rem",
    height: "0.375rem",
    flexShrink: 0,
    borderRadius: "9999px",
    backgroundColor: colors.accent,
  },
  text: {
    textWrap: "pretty",
    color: colors.mutedForeground,
  },
});

/**
 * SlideTwoColumn renders side-by-side content comparison or grouping.
 * Equal width columns with visual separator.
 */
export function SlideTwoColumn({
  left,
  right,
  className,
}: SlideTwoColumnProps) {
  return (
    <div {...mergeSx(stylex.props(styles.grid), className)}>
      <SlideColumn {...left} />
      <SlideColumn {...right} side="right" />
    </div>
  );
}

interface SlideColumnProps extends ColumnContent {
  side?: "left" | "right";
}

function SlideColumn({ title, items, side = "left" }: SlideColumnProps) {
  return (
    <div {...stylex.props(styles.column, side === "right" && styles.right)}>
      <div {...stylex.props(styles.heading)}>
        <div {...stylex.props(styles.accent)} />
        <h3 {...stylex.props(styles.title)}>{title}</h3>
      </div>
      <ul {...stylex.props(styles.items)}>
        {items.map((item) => (
          <li key={item} {...stylex.props(styles.item)}>
            <span {...stylex.props(styles.dot)} />
            <span {...stylex.props(styles.text)}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
