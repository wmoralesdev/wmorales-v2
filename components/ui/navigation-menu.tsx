import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as stylex from "@stylexjs/stylex";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  viewportWrap: {
    position: "absolute",
    top: "100%",
    left: 0,
    isolation: "isolate",
    zIndex: 50,
    display: "flex",
    justifyContent: "center",
  },
  viewport: {
    position: "relative",
    marginTop: "0.375rem",
    height: "var(--radix-navigation-menu-viewport-height)",
    width: "100%",
    transformOrigin: "top center",
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    animationName: "zoomIn",
    animationDuration: "150ms",
    ":is([data-state=closed])": {
      animationName: "zoomOut",
    },
    "@media (min-width: 768px)": {
      width: "var(--radix-navigation-menu-viewport-width)",
    },
  },
  root: {
    position: "relative",
    display: "flex",
    maxWidth: "max-content",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    display: "flex",
    flex: 1,
    listStyle: "none",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
  },
  item: {
    position: "relative",
  },
  trigger: {
    display: "inline-flex",
    height: "2.25rem",
    width: "max-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.background,
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
    fontWeight: 500,
    fontSize: "0.875rem",
    outline: "none",
    transitionProperty: "color, box-shadow, background-color",
    transitionDuration: "150ms",
    borderWidth: 0,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      outlineWidth: 1,
      outlineStyle: "solid",
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-state=open])": {
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
      color: colors.accentForeground,
    },
  },
  triggerIcon: {
    position: "relative",
    top: "1px",
    marginLeft: "0.25rem",
    width: "0.75rem",
    height: "0.75rem",
    transitionProperty: "transform",
    transitionDuration: "300ms",
  },
  content: {
    top: 0,
    left: 0,
    width: "100%",
    padding: "0.5rem",
    paddingRight: "0.625rem",
    animationName: "fadeIn",
    animationDuration: "150ms",
    "@media (min-width: 768px)": {
      position: "absolute",
      width: "auto",
    },
  },
  link: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    borderRadius: radii.sm,
    padding: "0.5rem",
    fontSize: "0.875rem",
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
      outlineWidth: 1,
      outlineStyle: "solid",
    },
    ":is([data-active=true])": {
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
      color: colors.accentForeground,
    },
  },
  indicator: {
    top: "100%",
    zIndex: 1,
    display: "flex",
    height: "0.375rem",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
    animationName: "fadeIn",
    animationDuration: "150ms",
    ":is([data-state=hidden])": {
      animationName: "fadeOut",
    },
  },
  indicatorArrow: {
    position: "relative",
    top: "60%",
    height: "0.5rem",
    width: "0.5rem",
    transform: "rotate(45deg)",
    borderTopLeftRadius: radii.sm,
    backgroundColor: colors.border,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
});

export function navigationMenuTriggerStyle({
  className,
}: {
  className?: string;
} = {}) {
  return mergeSx(stylex.props(styles.trigger), className).className ?? "";
}

function NavigationMenuViewport({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div {...stylex.props(styles.viewportWrap)}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        {...mergeSx(stylex.props(styles.viewport), className, style)}
        {...props}
      />
    </div>
  );
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      {...mergeSx(stylex.props(styles.list), className, style)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      {...mergeSx(stylex.props(styles.trigger), className, style)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        aria-hidden="true"
        {...stylex.props(styles.triggerIcon)}
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      {...mergeSx(stylex.props(styles.content), className, style)}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      {...mergeSx(stylex.props(styles.link), className, style)}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      {...mergeSx(stylex.props(styles.indicator), className, style)}
      {...props}
    >
      <div {...stylex.props(styles.indicatorArrow)} />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
