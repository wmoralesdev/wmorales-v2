import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingBlock: "1.5rem",
    color: colors.cardForeground,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
  },
  header: {
    display: "grid",
    gridAutoRows: "min-content",
    gridTemplateRows: "auto auto",
    alignItems: "start",
    gap: "0.375rem",
    paddingInline: "1.5rem",
  },
  title: {
    fontWeight: 600,
    lineHeight: 1,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
  action: {
    gridColumnStart: 2,
    gridRow: "1 / span 2",
    alignSelf: "start",
    justifySelf: "end",
  },
  content: {
    paddingInline: "1.5rem",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    paddingInline: "1.5rem",
  },
});

function Card({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      {...mergeSx(stylex.props(styles.card), className, style)}
      {...props}
    />
  );
}

function CardHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      {...mergeSx(stylex.props(styles.header), className, style)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

function CardAction({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      {...mergeSx(stylex.props(styles.action), className, style)}
      {...props}
    />
  );
}

function CardContent({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      {...mergeSx(stylex.props(styles.content), className, style)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
