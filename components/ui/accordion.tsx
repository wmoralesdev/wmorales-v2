"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as stylex from "@stylexjs/stylex";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  item: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    ":last-child": {
      borderBottomWidth: 0,
    },
  },
  header: {
    display: "flex",
  },
  trigger: {
    display: "flex",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    borderRadius: radii.md,
    paddingBlock: "1rem",
    textAlign: "left",
    fontWeight: 500,
    fontSize: "0.875rem",
    outline: "none",
    transitionProperty: "all",
    transitionDuration: "150ms",
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    color: colors.foreground,
    ":hover": {
      textDecoration: "underline",
    },
    ":focus-visible": {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-state=open]) > svg": {
      transform: "rotate(180deg)",
    },
  },
  icon: {
    pointerEvents: "none",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    transform: "translateY(0.125rem)",
    color: colors.mutedForeground,
    transitionProperty: "transform",
    transitionDuration: "200ms",
  },
  content: {
    overflow: "hidden",
    fontSize: "0.875rem",
  },
  contentInner: {
    paddingTop: 0,
    paddingBottom: "1rem",
  },
});

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header {...stylex.props(styles.header)}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        {...mergeSx(stylex.props(styles.trigger), className, style)}
        {...props}
      >
        {children}
        <ChevronDownIcon {...stylex.props(styles.icon)} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      {...stylex.props(styles.content)}
      {...props}
    >
      <div {...mergeSx(stylex.props(styles.contentInner), className, style)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
