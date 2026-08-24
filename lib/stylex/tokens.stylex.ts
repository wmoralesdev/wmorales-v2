import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  background: "var(--background)",
  foreground: "var(--foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  border: "var(--border)",
  ring: "var(--ring)",
  card: "var(--card)",
  cardForeground: "var(--card-foreground)",
  popover: "var(--popover)",
  popoverForeground: "var(--popover-foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  secondary: "var(--secondary)",
  secondaryForeground: "var(--secondary-foreground)",
  destructive: "var(--destructive)",
  input: "var(--input)",
});

export const fonts = stylex.defineVars({
  display: "var(--display-family), ui-sans-serif, system-ui, sans-serif",
  text: "var(--text-family), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--mono-family), ui-monospace, SFMono-Regular, monospace",
});

export const radii = stylex.defineVars({
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)",
  full: "9999px",
});
