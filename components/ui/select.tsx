"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import * as stylex from "@stylexjs/stylex";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  scrollButton: {
    display: "flex",
    cursor: "default",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "0.25rem",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    pointerEvents: "none",
    flexShrink: 0,
  },
  chevron: {
    width: "1rem",
    height: "1rem",
    opacity: 0.5,
  },
  trigger: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    whiteSpace: "nowrap",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: "transparent",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    transitionProperty: "color, box-shadow, border-color",
    transitionDuration: "150ms",
    color: colors.foreground,
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    ":is([aria-invalid=true])": {
      borderColor: colors.destructive,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.destructive}, transparent 80%)`,
    },
    ":is([data-size=default])": {
      height: "2.25rem",
    },
    ":is([data-size=sm])": {
      height: "2rem",
    },
    ":is([data-placeholder])": {
      color: colors.mutedForeground,
    },
  },
  content: {
    position: "relative",
    zIndex: 50,
    maxHeight: "var(--radix-select-content-available-height)",
    minWidth: "8rem",
    transformOrigin: "var(--radix-select-content-transform-origin)",
    overflowY: "auto",
    overflowX: "hidden",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    animationName: "fadeIn, zoomIn",
    animationDuration: "150ms",
    ":is([data-state=closed])": {
      animationName: "fadeOut, zoomOut",
    },
  },
  contentPopper: {
    ":is([data-side=left])": {
      transform: "translateX(-0.25rem)",
    },
    ":is([data-side=top])": {
      transform: "translateY(-0.25rem)",
    },
    ":is([data-side=right])": {
      transform: "translateX(0.25rem)",
    },
    ":is([data-side=bottom])": {
      transform: "translateY(0.25rem)",
    },
  },
  viewport: {
    padding: "0.25rem",
  },
  viewportPopper: {
    height: "var(--radix-select-trigger-height)",
    width: "100%",
    minWidth: "var(--radix-select-trigger-width)",
    scrollMarginBlock: "0.25rem",
  },
  label: {
    paddingInline: "0.5rem",
    paddingBlock: "0.375rem",
    color: colors.mutedForeground,
    fontSize: "0.75rem",
  },
  item: {
    position: "relative",
    display: "flex",
    width: "100%",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.sm,
    paddingBlock: "0.375rem",
    paddingRight: "2rem",
    paddingLeft: "0.5rem",
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
  itemIndicatorWrap: {
    position: "absolute",
    right: "0.5rem",
    display: "flex",
    width: "0.875rem",
    height: "0.875rem",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginInline: "-0.25rem",
    pointerEvents: "none",
    marginBlock: "0.25rem",
    height: "1px",
    backgroundColor: colors.border,
  },
});

function SelectScrollUpButton({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      {...mergeSx(stylex.props(styles.scrollButton), className, style)}
      {...props}
    >
      <ChevronUpIcon {...stylex.props(styles.icon)} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      {...mergeSx(stylex.props(styles.scrollButton), className, style)}
      {...props}
    >
      <ChevronDownIcon {...stylex.props(styles.icon)} />
    </SelectPrimitive.ScrollDownButton>
  );
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-size={size}
      data-slot="select-trigger"
      {...mergeSx(stylex.props(styles.trigger), className, style)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon {...stylex.props(styles.chevron)} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        {...mergeSx(
          stylex.props(
            styles.content,
            position === "popper" && styles.contentPopper,
          ),
          className,
          style,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          {...stylex.props(
            styles.viewport,
            position === "popper" && styles.viewportPopper,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      {...mergeSx(stylex.props(styles.label), className, style)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.itemIndicatorWrap)}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
