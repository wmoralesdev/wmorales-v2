"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as stylex from "@stylexjs/stylex";
import { XIcon } from "lucide-react";
import type * as React from "react";
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
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    animationName: "fadeIn, zoomIn",
    animationDuration: "200ms",
    "@media (min-width: 640px)": {
      maxWidth: "32rem",
    },
  },
  close: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    borderRadius: "2px",
    opacity: 0.7,
    cursor: "pointer",
    ":hover": {
      opacity: 1,
    },
    ":focus": {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
  },
  closeIcon: {
    width: "1rem",
    height: "1rem",
    pointerEvents: "none",
    flexShrink: 0,
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

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      {...mergeSx(stylex.props(styles.overlay), className, style)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            {...stylex.props(styles.close)}
          >
            <XIcon {...stylex.props(styles.closeIcon)} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      {...mergeSx(stylex.props(styles.header), className, style)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...mergeSx(stylex.props(styles.title), className, style)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      {...mergeSx(stylex.props(styles.description), className, style)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
