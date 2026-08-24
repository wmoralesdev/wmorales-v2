"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as stylex from "@stylexjs/stylex";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  content: {
    zIndex: 50,
    maxHeight: "var(--radix-dropdown-menu-content-available-height)",
    minWidth: "8rem",
    transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
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
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.sm,
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    fontSize: "0.875rem",
    outline: "none",
    userSelect: "none",
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":is([data-variant=destructive])": {
      color: colors.destructive,
    },
    ":is([data-variant=destructive]):focus": {
      backgroundColor: `color-mix(in oklch, ${colors.destructive}, transparent 90%)`,
      color: colors.destructive,
    },
    ":is([data-disabled])": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-inset=true])": {
      paddingLeft: "2rem",
    },
  },
  checkboxItem: {
    position: "relative",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.sm,
    paddingBlock: "0.375rem",
    paddingRight: "0.5rem",
    paddingLeft: "2rem",
    fontSize: "0.875rem",
    outline: "none",
    userSelect: "none",
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
    width: "1rem",
    height: "1rem",
  },
  subContent: {
    zIndex: 50,
    minWidth: "8rem",
    transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
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

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...mergeSx(stylex.props(styles.content), className, style)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      data-slot="dropdown-menu-checkbox-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      {...mergeSx(stylex.props(styles.checkboxItem), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorWrap)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon {...stylex.props(styles.radioIcon)} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...mergeSx(stylex.props(styles.label), className, style)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...mergeSx(stylex.props(styles.shortcut), className, style)}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...mergeSx(stylex.props(styles.subTrigger), className, style)}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.subIcon)} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      {...mergeSx(stylex.props(styles.subContent), className, style)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
