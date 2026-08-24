"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";

const styles = stylex.create({
  label: {
    display: "flex",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1,
  },
});

function Label({
  className,
  style,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      {...mergeSx(stylex.props(styles.label), className, style)}
      {...props}
    />
  );
}

export { Label };
