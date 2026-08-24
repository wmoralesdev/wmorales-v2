"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "inline-flex",
    height: "1.15rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    transitionProperty: "all",
    transitionDuration: "150ms",
    cursor: "pointer",
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    ":is([data-state=checked])": {
      backgroundColor: colors.primary,
    },
    ":is([data-state=unchecked])": {
      backgroundColor: colors.input,
    },
  },
  thumb: {
    pointerEvents: "none",
    display: "block",
    width: "1rem",
    height: "1rem",
    borderRadius: radii.full,
    backgroundColor: colors.background,
    boxShadow: "none",
    transitionProperty: "transform",
    transitionDuration: "150ms",
    ":is([data-state=checked])": {
      transform: "translateX(calc(100% - 2px))",
    },
    ":is([data-state=unchecked])": {
      transform: "translateX(0)",
    },
  },
});

function Switch({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        {...stylex.props(styles.thumb)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
