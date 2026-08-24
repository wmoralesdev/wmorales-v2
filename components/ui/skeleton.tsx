import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const pulse = stylex.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
});

const styles = stylex.create({
  root: {
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    borderRadius: radii.md,
    backgroundColor: colors.accent,
  },
});

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

export { Skeleton };
