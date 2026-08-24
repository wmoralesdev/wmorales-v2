"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import {
  type ToggleSize,
  type ToggleVariant,
  toggleVariants,
} from "@/components/ui/toggle";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    borderRadius: radii.md,
    ":is([data-variant=outline])": {
      boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    },
  },
  item: {
    minWidth: 0,
    flex: 1,
    flexShrink: 0,
    borderRadius: 0,
    boxShadow: "none",
    ":first-child": {
      borderTopLeftRadius: radii.md,
      borderBottomLeftRadius: radii.md,
    },
    ":last-child": {
      borderTopRightRadius: radii.md,
      borderBottomRightRadius: radii.md,
    },
    ":focus": {
      zIndex: 10,
    },
    ":focus-visible": {
      zIndex: 10,
    },
    ":is([data-variant=outline])": {
      borderLeftWidth: 0,
    },
    ":is([data-variant=outline]):first-child": {
      borderLeftWidth: 1,
      borderLeftStyle: "solid",
      borderLeftColor: colors.input,
    },
  },
});

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
}>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;

  return (
    <ToggleGroupPrimitive.Item
      data-size={resolvedSize}
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      {...mergeSx(
        {
          className: toggleVariants({
            variant: resolvedVariant,
            size: resolvedSize,
          }),
        },
        mergeSx(stylex.props(styles.item), className).className,
        style,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
