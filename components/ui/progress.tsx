"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
    height: "0.5rem",
    width: "100%",
    overflow: "hidden",
    borderRadius: radii.full,
    backgroundColor: `color-mix(in oklch, ${colors.primary}, transparent 80%)`,
  },
  indicator: {
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: colors.primary,
    transitionProperty: "transform",
    transitionDuration: "150ms",
  },
});

function Progress({
  className,
  value,
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        {...stylex.props(styles.indicator)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
