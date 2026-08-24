import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  footer: {
    paddingTop: "3rem",
  },
  copy: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 60%)`,
  },
});

export function MinimalFooter() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <p {...stylex.props(styles.copy)}>
        © {new Date().getFullYear()} Walter Morales
      </p>
    </footer>
  );
}
