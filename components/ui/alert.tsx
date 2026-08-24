import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
    display: "grid",
    width: "100%",
    gridTemplateColumns: "0 1fr",
    alignItems: "start",
    rowGap: "0.125rem",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    paddingInline: "1rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
  },
  default: {
    backgroundColor: colors.card,
    color: colors.cardForeground,
  },
  destructive: {
    backgroundColor: colors.card,
    color: colors.destructive,
  },
  title: {
    gridColumnStart: 2,
    minHeight: "1rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  description: {
    gridColumnStart: 2,
    display: "grid",
    justifyItems: "start",
    gap: "0.25rem",
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
});

function Alert({
  className,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      {...mergeSx(
        stylex.props(
          styles.root,
          variant === "destructive" ? styles.destructive : styles.default,
        ),
        className,
        style,
      )}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
