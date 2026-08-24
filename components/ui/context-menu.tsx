"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as stylex from "@stylexjs/stylex";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  subTrigger: {
    display: "flex",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    borderRadius: radii.sm,
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    fontSize: "0.875rem",
    outline: "none",
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":is([data-state=open])": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":is([data-inset=true])": {
      paddingLeft: "2rem",
    },
  },
  subIcon: {
    marginLeft: "auto",
  },
  subContent: {
    zIndex: 50,
    minWidth: "8rem",
    transformOrigin: "var(--radix-context-menu-content-transform-origin)",
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    padding: "0.25rem",
    color: colors.popoverForeground,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    animationName: "fadeIn, zoomIn",
    animationDuration: "150ms",
    ":is([data-state=closed])": {
      animationName: "fadeOut, zoomOut",
    },
  },
  content: {
    zIndex: 50,
    maxHeight: "var(--radix-context-menu-content-available-height)",
    minWidth: "8rem",
    transformOrigin: "var(--radix-context-menu-content-transform-origin)",
    overflowY: "auto",
    overflowX: "hidden",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    padding: "0.25rem",
    color: colors.popoverForeground,
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    animationName: "fadeIn, zoomIn",
    animationDuration: "150ms",
    ":is([data-state=closed])": {
      animationName: "fadeOut, zoomOut",
    },
  },
  item: {
    position: "relative",
    display: "flex",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.sm,
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    fontSize: "0.875rem",
    outline: "none",
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":is([data-disabled])": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-inset=true])": {
      paddingLeft: "2rem",
    },
    ":is([data-variant=destructive])": {
      color: colors.destructive,
    },
    ":is([data-variant=destructive]):focus": {
      backgroundColor: `color-mix(in oklch, ${colors.destructive}, transparent 90%)`,
      color: colors.destructive,
    },
  },
  checkboxItem: {
    position: "relative",
    display: "flex",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.sm,
    paddingBlock: "0.375rem",
    paddingRight: "0.5rem",
    paddingLeft: "2rem",
    fontSize: "0.875rem",
    outline: "none",
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":is([data-disabled])": {
      pointerEvents: "none",
      opacity: 0.5,
    },
  },
  indicatorWrap: {
    pointerEvents: "none",
    position: "absolute",
    left: "0.5rem",
    display: "flex",
    width: "0.875rem",
    height: "0.875rem",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    pointerEvents: "none",
    flexShrink: 0,
  },
  radioIcon: {
    width: "0.5rem",
    height: "0.5rem",
    fill: "currentColor",
  },
  label: {
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    fontWeight: 500,
    color: colors.foreground,
    fontSize: "0.875rem",
    ":is([data-inset=true])": {
      paddingLeft: "2rem",
    },
  },
  separator: {
    marginInline: "-0.25rem",
    marginBlock: "0.25rem",
    height: "1px",
    backgroundColor: colors.border,
  },
  shortcut: {
    marginLeft: "auto",
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
  },
});

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
      {...mergeSx(stylex.props(styles.subTrigger), className, style)}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.subIcon)} />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      {...mergeSx(stylex.props(styles.subContent), className, style)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      data-slot="context-menu-checkbox-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon {...stylex.props(styles.radioIcon)} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-inset={inset}
      data-slot="context-menu-label"
      {...mergeSx(stylex.props(styles.label), className, style)}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      {...mergeSx(stylex.props(styles.shortcut), className, style)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
