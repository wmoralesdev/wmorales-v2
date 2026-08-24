"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
  },
  viewport: {
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    outline: "none",
    transitionProperty: "color, box-shadow",
    transitionDuration: "150ms",
    ":focus-visible": {
      outlineWidth: 1,
      outlineStyle: "solid",
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
  },
  scrollbar: {
    display: "flex",
    touchAction: "none",
    userSelect: "none",
    padding: "1px",
    transitionProperty: "colors",
    transitionDuration: "150ms",
  },
  scrollbarVertical: {
    height: "100%",
    width: "0.625rem",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: "transparent",
  },
  scrollbarHorizontal: {
    height: "0.625rem",
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "transparent",
  },
  thumb: {
    position: "relative",
    flex: 1,
    borderRadius: "9999px",
    backgroundColor: colors.border,
  },
});

function ScrollBar({
  className,
  orientation = "vertical",
  style,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...mergeSx(
        stylex.props(
          styles.scrollbar,
          orientation === "horizontal"
            ? styles.scrollbarHorizontal
            : styles.scrollbarVertical,
        ),
        className,
        style,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        {...stylex.props(styles.thumb)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

function ScrollArea({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        {...stylex.props(styles.viewport)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea, ScrollBar };
