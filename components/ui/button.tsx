import { Slot } from "@radix-ui/react-slot";
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
    fontSize: "0.875rem",
    fontWeight: 500,
    transitionProperty: "color, background-color, border-color, box-shadow, transform",
    transitionDuration: "150ms",
    flexShrink: 0,
    outline: "none",
    borderWidth: 0,
    cursor: "pointer",
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":active": {
      transform: "scale(0.95)",
    },
  },
  default: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 10%)`,
    },
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: "white",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.destructive}, transparent 10%)`,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.destructive}, transparent 80%)`,
    },
  },
  outline: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.secondary}, transparent 20%)`,
    },
  },
  ghost: {
    backgroundColor: "transparent",
    color: colors.foreground,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  link: {
    backgroundColor: "transparent",
    color: colors.accent,
    textUnderlineOffset: "4px",
    ":hover": {
      textDecoration: "underline",
    },
  },
  sizeDefault: {
    height: "2.25rem",
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
  },
  sizeSm: {
    height: "2rem",
    gap: "0.375rem",
    borderRadius: radii.md,
    paddingInline: "0.75rem",
  },
  sizeLg: {
    height: "2.5rem",
    borderRadius: radii.md,
    paddingInline: "1.5rem",
  },
  sizeIcon: {
    width: "2.25rem",
    height: "2.25rem",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    pointerEvents: "none",
    flexShrink: 0,
  },
});

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantStyles = {
  default: styles.default,
  destructive: styles.destructive,
  outline: styles.outline,
  secondary: styles.secondary,
  ghost: styles.ghost,
  link: styles.link,
} as const;

const sizeStyles = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
} as const;

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return (
    mergeSx(
      stylex.props(styles.base, variantStyles[variant], sizeStyles[size]),
      className,
    ).className ?? ""
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      {...mergeSx(
        stylex.props(styles.base, variantStyles[variant], sizeStyles[size]),
        className,
        style,
      )}
      {...props}
    />
  );
}

export { Button, styles as buttonStyles };
