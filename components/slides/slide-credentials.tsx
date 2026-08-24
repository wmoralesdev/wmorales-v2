import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface CredentialGroup {
  category: string;
  items: string[];
}

interface SlideCredentialsProps {
  credentials: CredentialGroup[];
  className?: string;
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gap: "1.5rem",
  },
  cols1: {
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  },
  cols2: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  cols3: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  accent: {
    height: "0.125rem",
    width: "1.5rem",
    backgroundColor: colors.accent,
  },
  category: {
    fontFamily: fonts.display,
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    color: colors.accent,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  dot: {
    marginTop: "0.375rem",
    width: "0.25rem",
    height: "0.25rem",
    flexShrink: 0,
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
  },
});

/**
 * SlideCredentials renders credential groups in a grid layout.
 * Used in Profile slides. Max 3 groups recommended.
 */
export function SlideCredentials({
  credentials,
  className,
}: SlideCredentialsProps) {
  return (
    <div
      {...mergeSx(
        stylex.props(
          styles.grid,
          credentials.length === 1 && styles.cols1,
          credentials.length === 2 && styles.cols2,
          credentials.length >= 3 && styles.cols3,
        ),
        className,
      )}
    >
      {credentials.map((group) => (
        <div key={group.category} {...stylex.props(styles.group)}>
          <div {...stylex.props(styles.heading)}>
            <div {...stylex.props(styles.accent)} />
            <h4 {...stylex.props(styles.category)}>{group.category}</h4>
          </div>
          <ul {...stylex.props(styles.items)}>
            {group.items.map((item) => (
              <li key={item} {...stylex.props(styles.item)}>
                <span {...stylex.props(styles.dot)} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
