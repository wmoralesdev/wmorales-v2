"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as stylex from "@stylexjs/stylex";
import { CircleIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "grid",
    gap: "0.75rem",
  },
  item: {
    aspectRatio: "1 / 1",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    borderRadius: "9999px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    color: colors.primary,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    backgroundColor: "transparent",
    transitionProperty: "color, box-shadow, border-color",
    transitionDuration: "150ms",
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
  },
  indicator: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0.5rem",
    height: "0.5rem",
    transform: "translate(-50%, -50%)",
    fill: colors.primary,
  },
});

function RadioGroup({
  className,
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CircleIcon {...stylex.props(styles.icon)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
