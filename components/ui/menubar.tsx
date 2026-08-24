"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import * as stylex from "@stylexjs/stylex";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    height: "2.25rem",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: "0.25rem",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
  },
  trigger: {
    display: "flex",
    userSelect: "none",
    alignItems: "center",
    borderRadius: radii.sm,
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontWeight: 500,
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
  },
  content: {
    zIndex: 50,
    minWidth: "12rem",
    transformOrigin: "var(--radix-menubar-content-transform-origin)",
    overflow: "hidden",
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
    height: "1rem",
    width: "1rem",
  },
  subContent: {
    zIndex: 50,
    minWidth: "8rem",
    transformOrigin: "var(--radix-menubar-content-transform-origin)",
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
});

function Menubar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      {...mergeSx(stylex.props(styles.trigger), className, style)}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        data-slot="menubar-content"
        sideOffset={sideOffset}
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-inset={inset}
      data-slot="menubar-item"
      data-variant={variant}
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      data-slot="menubar-checkbox-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon {...stylex.props(styles.radioIcon)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-inset={inset}
      data-slot="menubar-label"
      {...mergeSx(stylex.props(styles.label), className, style)}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      {...mergeSx(stylex.props(styles.shortcut), className, style)}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-inset={inset}
      data-slot="menubar-sub-trigger"
      {...mergeSx(stylex.props(styles.subTrigger), className, style)}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.subIcon)} />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      {...mergeSx(stylex.props(styles.subContent), className, style)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
