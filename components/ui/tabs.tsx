"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  list: {
    display: "inline-flex",
    height: "2.25rem",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    padding: "3px",
    color: colors.mutedForeground,
  },
  trigger: {
    display: "inline-flex",
    height: "calc(100% - 1px)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    whiteSpace: "nowrap",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontWeight: 500,
    color: colors.foreground,
    fontSize: "0.875rem",
    transitionProperty: "color, box-shadow, background-color",
    transitionDuration: "150ms",
    backgroundColor: "transparent",
    cursor: "pointer",
    ":focus-visible": {
      borderColor: colors.ring,
      outline: `1px solid ${colors.ring}`,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-state=active])": {
      backgroundColor: colors.background,
      boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    },
  },
  content: {
    flex: 1,
    outline: "none",
  },
});

function Tabs({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

function TabsList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      {...mergeSx(stylex.props(styles.list), className, style)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      {...mergeSx(stylex.props(styles.trigger), className, style)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      {...mergeSx(stylex.props(styles.content), className, style)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
