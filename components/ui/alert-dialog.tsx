"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgb(0 0 0 / 0.5)",
    animationName: "fadeIn",
    animationDuration: "200ms",
  },
  content: {
    position: "fixed",
    top: "50%",
    left: "50%",
    zIndex: 50,
    display: "grid",
    width: "100%",
    maxWidth: "calc(100% - 2rem)",
    transform: "translate(-50%, -50%)",
    gap: "1rem",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: "1.5rem",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    animationName: "fadeIn, zoomIn",
    animationDuration: "200ms",
    "@media (min-width: 640px)": {
      maxWidth: "32rem",
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    textAlign: "center",
    "@media (min-width: 640px)": {
      textAlign: "left",
    },
  },
  footer: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: "0.5rem",
    "@media (min-width: 640px)": {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  },
  title: {
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: 1,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
});

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      {...mergeSx(stylex.props(styles.overlay), className, style)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      {...mergeSx(stylex.props(styles.header), className, style)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      {...mergeSx({ className: buttonVariants() }, className, style)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      {...mergeSx(
        { className: buttonVariants({ variant: "outline" }) },
        className,
        style,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
