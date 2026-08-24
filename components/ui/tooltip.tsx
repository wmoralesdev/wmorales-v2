"use client";

import * as stylex from "@stylexjs/stylex";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  content: {
    zIndex: 50,
    width: "fit-content",
    transformOrigin: "var(--radix-tooltip-content-transform-origin)",
    textWrap: "balance",
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    paddingInline: "0.75rem",
    paddingBlock: "0.375rem",
    color: colors.primaryForeground,
    fontSize: "0.75rem",
    animationName: "fadeIn, zoomIn",
    animationDuration: "150ms",
    ":is([data-state=closed])": {
      animationName: "fadeOut, zoomOut",
    },
  },
  arrow: {
    zIndex: 50,
    width: "0.625rem",
    height: "0.625rem",
    transform: "translateY(calc(-50% - 2px)) rotate(45deg)",
    borderRadius: "2px",
    backgroundColor: colors.primary,
    fill: colors.primary,
  },
});

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow {...stylex.props(styles.arrow)} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
