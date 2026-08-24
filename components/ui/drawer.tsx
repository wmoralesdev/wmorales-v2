"use client";

import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
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
    zIndex: 50,
    display: "flex",
    height: "auto",
    flexDirection: "column",
    backgroundColor: colors.background,
    ":is([data-vaul-drawer-direction=top])": {
      insetInline: 0,
      top: 0,
      marginBottom: "6rem",
      maxHeight: "80vh",
      borderBottomLeftRadius: radii.lg,
      borderBottomRightRadius: radii.lg,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: colors.border,
    },
    ":is([data-vaul-drawer-direction=bottom])": {
      insetInline: 0,
      bottom: 0,
      marginTop: "6rem",
      maxHeight: "80vh",
      borderTopLeftRadius: radii.lg,
      borderTopRightRadius: radii.lg,
      borderTopWidth: 1,
      borderTopStyle: "solid",
      borderTopColor: colors.border,
    },
    ":is([data-vaul-drawer-direction=right])": {
      insetBlock: 0,
      right: 0,
      width: "75%",
      borderLeftWidth: 1,
      borderLeftStyle: "solid",
      borderLeftColor: colors.border,
    },
    ":is([data-vaul-drawer-direction=left])": {
      insetBlock: 0,
      left: 0,
      width: "75%",
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: colors.border,
    },
    "@media (min-width: 640px)": {
      ":is([data-vaul-drawer-direction=right])": {
        maxWidth: "24rem",
      },
      ":is([data-vaul-drawer-direction=left])": {
        maxWidth: "24rem",
      },
    },
  },
  handle: {
    marginInline: "auto",
    marginTop: "1rem",
    display: "none",
    height: "0.5rem",
    width: "100px",
    flexShrink: 0,
    borderRadius: radii.full,
    backgroundColor: colors.muted,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    padding: "1rem",
    "@media (min-width: 768px)": {
      gap: "0.375rem",
      textAlign: "left",
    },
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

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      {...mergeSx(stylex.props(styles.overlay), className, style)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      >
        <div {...stylex.props(styles.handle)} />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      {...mergeSx(stylex.props(styles.header), className, style)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
