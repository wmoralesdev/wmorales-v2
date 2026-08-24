"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap",
    borderRadius: radii.md,
    fontWeight: 500,
    fontSize: "0.875rem",
    outline: "none",
    transitionProperty: "color, box-shadow, background-color, border-color",
    transitionDuration: "150ms",
    cursor: "pointer",
    borderWidth: 0,
    ":hover": {
      backgroundColor: colors.muted,
      color: colors.mutedForeground,
    },
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([aria-invalid=true])": {
      borderColor: colors.destructive,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.destructive}, transparent 80%)`,
    },
    ":is([data-state=on])": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  default: {
    backgroundColor: "transparent",
  },
  outline: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: "transparent",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  sizeDefault: {
    height: "2.25rem",
    minWidth: "2.25rem",
    paddingInline: "0.5rem",
  },
  sizeSm: {
    height: "2rem",
    minWidth: "2rem",
    paddingInline: "0.375rem",
  },
  sizeLg: {
    height: "2.5rem",
    minWidth: "2.5rem",
    paddingInline: "0.625rem",
  },
});

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "sm" | "lg";

const variantStyles = {
  default: styles.default,
  outline: styles.outline,
} as const;

const sizeStyles = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
} as const;

export function toggleVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
} = {}) {
  return (
    mergeSx(
      stylex.props(styles.base, variantStyles[variant], sizeStyles[size]),
      className,
    ).className ?? ""
  );
}

function Toggle({
  className,
  variant = "default",
  size = "default",
  style,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      {...mergeSx(
        stylex.props(styles.base, variantStyles[variant], sizeStyles[size]),
        className,
        style,
      )}
      {...props}
    />
  );
}

export { Toggle };
