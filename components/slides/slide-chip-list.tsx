import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

interface SlideChipListProps {
  chips: string[];
  className?: string;
}

const styles = stylex.create({
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
    paddingInline: "0.75rem",
    paddingBlock: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: colors.accent,
    "@media (min-width: 768px)": {
      fontSize: "0.875rem",
    },
  },
});

/**
 * SlideChipList renders compact topic or audience chips within a slide.
 */
export function SlideChipList({ chips, className }: SlideChipListProps) {
  if (chips.length === 0) return null;

  return (
    <div {...mergeSx(stylex.props(styles.list), className)}>
      {chips.map((chip) => (
        <span key={chip} {...stylex.props(styles.chip)}>
          {chip}
        </span>
      ))}
    </div>
  );
}
