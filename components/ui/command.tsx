"use client";

import * as stylex from "@stylexjs/stylex";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: radii.md,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
  },
  dialogContent: {
    overflow: "hidden",
    padding: 0,
  },
  inputWrapper: {
    display: "flex",
    height: "2.25rem",
    alignItems: "center",
    gap: "0.5rem",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    paddingInline: "0.75rem",
  },
  searchIcon: {
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    opacity: 0.5,
  },
  input: {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    borderRadius: radii.md,
    backgroundColor: "transparent",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    borderWidth: 0,
    color: colors.foreground,
    "::placeholder": {
      color: colors.mutedForeground,
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
  list: {
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
  },
  empty: {
    paddingBlock: "1.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  group: {
    overflow: "hidden",
    padding: "0.25rem",
    color: colors.foreground,
  },
  separator: {
    marginInline: "-0.25rem",
    height: 1,
    backgroundColor: colors.border,
  },
  item: {
    position: "relative",
    display: "flex",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.125rem",
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    fontSize: "0.875rem",
    outline: "none",
    ":is([data-selected=true])": {
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 85%)`,
      color: colors.accentForeground,
    },
  },
  shortcut: {
    marginLeft: "auto",
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
  },
});

function Command({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={className}
        showCloseButton={showCloseButton}
        {...stylex.props(styles.dialogContent)}
      >
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" {...stylex.props(styles.inputWrapper)}>
      <SearchIcon {...stylex.props(styles.searchIcon)} />
      <CommandPrimitive.Input
        data-slot="command-input"
        {...mergeSx(stylex.props(styles.input), className, style)}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      {...mergeSx(stylex.props(styles.list), className, style)}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      {...stylex.props(styles.empty)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      {...mergeSx(stylex.props(styles.group), className, style)}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      {...mergeSx(stylex.props(styles.shortcut), className, style)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
