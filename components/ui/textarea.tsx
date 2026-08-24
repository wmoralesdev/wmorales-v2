import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  textarea: {
    display: "flex",
    fieldSizing: "content",
    minHeight: "4rem",
    width: "100%",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: "transparent",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
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

function Textarea({
  className,
  style,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      {...mergeSx(stylex.props(styles.textarea), className, style)}
      {...props}
    />
  );
}

export { Textarea };
