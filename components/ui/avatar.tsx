"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "9999px",
  },
  image: {
    aspectRatio: "1 / 1",
    width: "100%",
    height: "100%",
  },
  fallback: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: colors.muted,
  },
});

function Avatar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...mergeSx(stylex.props(styles.image), className, style)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...mergeSx(stylex.props(styles.fallback), className, style)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
