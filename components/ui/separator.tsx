"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  base: {
    flexShrink: 0,
    backgroundColor: colors.border,
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    height: "100%",
    width: 1,
  },
});

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  style,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...mergeSx(
        stylex.props(
          styles.base,
          orientation === "vertical" ? styles.vertical : styles.horizontal,
        ),
        className,
        style,
      )}
      {...props}
    />
  );
}

export { Separator };
