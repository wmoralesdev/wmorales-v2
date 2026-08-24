import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  input: {
    display: "flex",
    height: "2.25rem",
    width: "100%",
    minWidth: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: "transparent",
    paddingInline: "0.75rem",
    paddingBlock: "0.25rem",
    fontSize: "1rem",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    transitionProperty: "color, box-shadow, border-color",
    transitionDuration: "150ms",
    color: colors.foreground,
    "::placeholder": {
      color: colors.mutedForeground,
    },
    ":disabled": {
      pointerEvents: "none",
      cursor: "not-allowed",
      opacity: 0.5,
    },
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    "@media (min-width: 768px)": {
      fontSize: "0.875rem",
    },
  },
});

function Input({
  className,
  type,
  style,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      {...mergeSx(stylex.props(styles.input), className, style)}
      {...props}
    />
  );
}

export { Input };
