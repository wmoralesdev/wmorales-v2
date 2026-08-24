import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface SlideListProps {
  items: string[];
  className?: string;
  /**
   * Whether to show numbered items instead of bullets.
   */
  numbered?: boolean;
}

const styles = stylex.create({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontSize: "1.125rem",
    "@media (min-width: 768px)": {
      fontSize: "1.25rem",
    },
  },
  numbered: {
    listStyleType: "decimal",
    paddingLeft: "1.5rem",
  },
  bullets: {
    listStyleType: "none",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  bullet: {
    marginTop: "0.5rem",
    width: "0.5rem",
    height: "0.5rem",
    flexShrink: 0,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
  text: {
    textWrap: "pretty",
    color: colors.foreground,
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  stepNumber: {
    display: "flex",
    width: "2.25rem",
    height: "2.25rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    fontFamily: fonts.display,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: colors.accentForeground,
    boxShadow: `0 10px 15px -3px color-mix(in oklch, ${colors.accent}, transparent 80%)`,
  },
  stepText: {
    paddingTop: "0.375rem",
    fontSize: "1.125rem",
    textWrap: "pretty",
    color: colors.foreground,
    "@media (min-width: 768px)": {
      fontSize: "1.25rem",
    },
  },
});

/**
 * SlideList renders bullet points or numbered lists for slides.
 * Max 5 items recommended for readability.
 */
export function SlideList({
  items,
  className,
  numbered = false,
}: SlideListProps) {
  const ListTag = numbered ? "ol" : "ul";

  return (
    <ListTag
      {...mergeSx(
        stylex.props(styles.list, numbered ? styles.numbered : styles.bullets),
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} {...stylex.props(styles.item)}>
          {!numbered && <span {...stylex.props(styles.bullet)} />}
          <span {...stylex.props(styles.text)}>{item}</span>
        </li>
      ))}
    </ListTag>
  );
}

interface SlideNumberedStepsProps {
  steps: string[];
  className?: string;
}

/**
 * SlideNumberedSteps renders numbered steps with emphasis.
 * Used for CTA slides and action items.
 */
export function SlideNumberedSteps({
  steps,
  className,
}: SlideNumberedStepsProps) {
  return (
    <ol {...mergeSx(stylex.props(styles.steps), className)}>
      {steps.map((step, index) => (
        <li key={step} {...stylex.props(styles.item)}>
          <span {...stylex.props(styles.stepNumber)}>{index + 1}</span>
          <span {...stylex.props(styles.stepText)}>{step}</span>
        </li>
      ))}
    </ol>
  );
}
