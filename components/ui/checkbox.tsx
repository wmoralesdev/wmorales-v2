"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as stylex from "@stylexjs/stylex";
import { CheckIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    borderRadius: "4px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    transitionProperty: "box-shadow, background-color, border-color, color",
    transitionDuration: "150ms",
    backgroundColor: "transparent",
    color: colors.primaryForeground,
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    ":is([aria-invalid=true])": {
      borderColor: colors.destructive,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.destructive}, transparent 80%)`,
    },
    ":is([data-state=checked])": {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "currentColor",
  },
  icon: {
    width: "0.875rem",
    height: "0.875rem",
  },
});

function Checkbox({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CheckIcon {...stylex.props(styles.icon)} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
