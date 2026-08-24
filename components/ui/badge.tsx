import { Slot } from "@radix-ui/react-slot";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    width: "fit-content",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    overflow: "hidden",
    whiteSpace: "nowrap",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    paddingInline: "0.5rem",
    paddingBlock: "0.125rem",
    fontWeight: 500,
    fontSize: "0.75rem",
    transitionProperty: "color, box-shadow",
    transitionDuration: "150ms",
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
  },
  default: {
    borderColor: "transparent",
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  secondary: {
    borderColor: "transparent",
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  destructive: {
    borderColor: "transparent",
    backgroundColor: colors.destructive,
    color: "white",
  },
  outline: {
    borderColor: colors.border,
    backgroundColor: "transparent",
    color: colors.foreground,
  },
});

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const variantStyles = {
  default: styles.default,
  secondary: styles.secondary,
  destructive: styles.destructive,
  outline: styles.outline,
} as const;

export function badgeVariants({
  variant = "default",
  className,
}: {
  variant?: BadgeVariant;
  className?: string;
} = {}) {
  return (
    mergeSx(stylex.props(styles.base, variantStyles[variant]), className)
      .className ?? ""
  );
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: BadgeVariant;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      {...mergeSx(
        stylex.props(styles.base, variantStyles[variant]),
        className,
        style,
      )}
      {...props}
    />
  );
}

export { Badge };
