"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as stylex from "@stylexjs/stylex";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

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
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: colors.background,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transitionProperty: "transform",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "300ms",
  },
  sideRight: {
    insetBlock: 0,
    right: 0,
    height: "100%",
    width: "75%",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.border,
    "@media (min-width: 640px)": {
      maxWidth: "24rem",
    },
  },
  sideLeft: {
    insetBlock: 0,
    left: 0,
    height: "100%",
    width: "75%",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.border,
    "@media (min-width: 640px)": {
      maxWidth: "24rem",
    },
  },
  sideTop: {
    insetInline: 0,
    top: 0,
    height: "auto",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  sideBottom: {
    insetInline: 0,
    bottom: 0,
    height: "auto",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
  },
  close: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    borderRadius: "2px",
    opacity: 0.7,
    cursor: "pointer",
    backgroundColor: "transparent",
    borderWidth: 0,
    ":hover": {
      opacity: 1,
    },
    ":focus": {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
    ":disabled": {
      pointerEvents: "none",
    },
    ":is([data-state=open])": {
      backgroundColor: colors.secondary,
    },
  },
  closeIcon: {
    width: "1rem",
    height: "1rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
    padding: "1rem",
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
  },
  title: {
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
});

const sideStyles = {
  right: styles.sideRight,
  left: styles.sideLeft,
  top: styles.sideTop,
  bottom: styles.sideBottom,
} as const;

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      {...mergeSx(stylex.props(styles.overlay), className, style)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        {...mergeSx(
          stylex.props(styles.content, sideStyles[side]),
          className,
          style,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close {...stylex.props(styles.close)}>
          <XIcon {...stylex.props(styles.closeIcon)} />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      {...mergeSx(stylex.props(styles.header), className, style)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
