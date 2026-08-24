/* eslint-disable @typescript-eslint/naming-convention */
"use client";

import { Slot } from "@radix-ui/react-slot";
import * as stylex from "@stylexjs/stylex";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const styles = stylex.create({
  provider: {
    display: "flex",
    minHeight: "100svh",
    width: "100%",
  },
  sidebarFixed: {
    display: "flex",
    height: "100%",
    width: "var(--sidebar-width)",
    flexDirection: "column",
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  sidebarMobileContent: {
    width: "var(--sidebar-width)",
    backgroundColor: colors.background,
    padding: 0,
    color: colors.foreground,
  },
  sidebarMobileInner: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  sidebarPeer: {
    color: colors.foreground,
    display: "none",
    "@media (min-width: 768px)": {
      display: "block",
    },
  },
  gap: {
    position: "relative",
    width: "var(--sidebar-width)",
    backgroundColor: "transparent",
    transitionProperty: "width",
    transitionDuration: "200ms",
    transitionTimingFunction: "linear",
    ":is([data-collapsible=offcanvas])": {
      width: 0,
    },
    ":is([data-collapsible=icon])": {
      width: "var(--sidebar-width-icon)",
    },
  },
  gapFloating: {
    ":is([data-collapsible=icon])": {
      width: "calc(var(--sidebar-width-icon) + 1rem)",
    },
  },
  container: {
    position: "fixed",
    insetBlock: 0,
    zIndex: 10,
    display: "none",
    height: "100svh",
    width: "var(--sidebar-width)",
    transitionProperty: "left, right, width",
    transitionDuration: "200ms",
    transitionTimingFunction: "linear",
    "@media (min-width: 768px)": {
      display: "flex",
    },
    ":is([data-collapsible=icon])": {
      width: "var(--sidebar-width-icon)",
    },
  },
  containerLeft: {
    left: 0,
    ":is([data-collapsible=offcanvas])": {
      left: "calc(var(--sidebar-width) * -1)",
    },
  },
  containerRight: {
    right: 0,
    ":is([data-collapsible=offcanvas])": {
      right: "calc(var(--sidebar-width) * -1)",
    },
  },
  containerFloating: {
    padding: "0.5rem",
    ":is([data-collapsible=icon])": {
      width: "calc(var(--sidebar-width-icon) + 1rem + 2px)",
    },
  },
  containerBordered: {
    ":is([data-side=left])": {
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: colors.border,
    },
    ":is([data-side=right])": {
      borderLeftWidth: 1,
      borderLeftStyle: "solid",
      borderLeftColor: colors.border,
    },
  },
  inner: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: colors.background,
    ":is([data-variant=floating])": {
      borderRadius: radii.lg,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.border,
      boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    },
  },
  trigger: {
    width: "1.75rem",
    height: "1.75rem",
  },
  rail: {
    position: "absolute",
    insetBlock: 0,
    zIndex: 20,
    display: "none",
    width: "1rem",
    transform: "translateX(-50%)",
    transitionProperty: "all",
    transitionTimingFunction: "linear",
    "@media (min-width: 640px)": {
      display: "flex",
    },
  },
  inset: {
    position: "relative",
    display: "flex",
    width: "100%",
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.background,
  },
  input: {
    height: "2rem",
    width: "100%",
    backgroundColor: colors.background,
    boxShadow: "none",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.5rem",
  },
  separator: {
    marginInline: "0.5rem",
    width: "auto",
    backgroundColor: colors.border,
  },
  content: {
    display: "flex",
    minHeight: 0,
    flex: 1,
    flexDirection: "column",
    gap: "0.5rem",
    overflow: "auto",
  },
  group: {
    position: "relative",
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    padding: "0.5rem",
  },
  groupLabel: {
    display: "flex",
    height: "2rem",
    flexShrink: 0,
    alignItems: "center",
    borderRadius: radii.md,
    paddingInline: "0.5rem",
    fontWeight: 500,
    color: `color-mix(in oklch, ${colors.foreground}, transparent 30%)`,
    fontSize: "0.75rem",
    outline: "none",
    transitionProperty: "margin, opacity",
    transitionDuration: "200ms",
    transitionTimingFunction: "linear",
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
  },
  groupAction: {
    position: "absolute",
    top: "0.875rem",
    right: "0.75rem",
    display: "flex",
    aspectRatio: "1 / 1",
    width: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    padding: 0,
    color: colors.foreground,
    outline: "none",
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
  },
  groupContent: {
    width: "100%",
    fontSize: "0.875rem",
  },
  menu: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.25rem",
  },
  menuItem: {
    position: "relative",
  },
  menuButton: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.5rem",
    overflow: "hidden",
    borderRadius: radii.md,
    padding: "0.5rem",
    textAlign: "left",
    fontSize: "0.875rem",
    outline: "none",
    transitionProperty: "width, height, padding, background-color, color",
    transitionDuration: "150ms",
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    color: colors.foreground,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
    ":active": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([aria-disabled=true])": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-active=true])": {
      backgroundColor: colors.accent,
      fontWeight: 500,
      color: colors.accentForeground,
    },
  },
  menuButtonOutline: {
    backgroundColor: colors.background,
    boxShadow: `0 0 0 1px ${colors.border}`,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
      boxShadow: `0 0 0 1px ${colors.accent}`,
    },
  },
  menuButtonSm: {
    height: "1.75rem",
    fontSize: "0.75rem",
  },
  menuButtonDefault: {
    height: "2rem",
    fontSize: "0.875rem",
  },
  menuButtonLg: {
    height: "3rem",
    fontSize: "0.875rem",
  },
  menuAction: {
    position: "absolute",
    top: "0.375rem",
    right: "0.25rem",
    display: "flex",
    aspectRatio: "1 / 1",
    width: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    padding: 0,
    color: colors.foreground,
    outline: "none",
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
  },
  menuActionHover: {
    "@media (min-width: 768px)": {
      opacity: 0,
    },
    ":is([data-state=open])": {
      opacity: 1,
    },
  },
  menuBadge: {
    pointerEvents: "none",
    position: "absolute",
    right: "0.25rem",
    display: "flex",
    height: "1.25rem",
    minWidth: "1.25rem",
    userSelect: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    paddingInline: "0.25rem",
    fontWeight: 500,
    color: colors.foreground,
    fontSize: "0.75rem",
    fontVariantNumeric: "tabular-nums",
  },
  menuSkeleton: {
    display: "flex",
    height: "2rem",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: radii.md,
    paddingInline: "0.5rem",
  },
  menuSkeletonIcon: {
    width: "1rem",
    height: "1rem",
    borderRadius: radii.md,
  },
  menuSkeletonText: {
    height: "1rem",
    flex: 1,
  },
  menuSub: {
    marginInline: "0.875rem",
    display: "flex",
    minWidth: 0,
    transform: "translateX(1px)",
    flexDirection: "column",
    gap: "0.25rem",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.border,
    paddingInline: "0.625rem",
    paddingBlock: "0.125rem",
  },
  menuSubItem: {
    position: "relative",
  },
  menuSubButton: {
    display: "flex",
    height: "1.75rem",
    minWidth: 0,
    transform: "translateX(-1px)",
    alignItems: "center",
    gap: "0.5rem",
    overflow: "hidden",
    borderRadius: radii.md,
    paddingInline: "0.5rem",
    color: colors.foreground,
    outline: "none",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${colors.ring}`,
    },
    ":active": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([aria-disabled=true])": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    ":is([data-active=true])": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  menuSubButtonSm: {
    fontSize: "0.75rem",
  },
  menuSubButtonMd: {
    fontSize: "0.875rem",
  },
});

export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuButtonSize = "default" | "sm" | "lg";

const menuButtonVariantStyles = {
  default: styles.menuButton,
  outline: styles.menuButtonOutline,
} as const;

const menuButtonSizeStyles = {
  default: styles.menuButtonDefault,
  sm: styles.menuButtonSm,
  lg: styles.menuButtonLg,
} as const;

export function sidebarMenuButtonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
  className?: string;
} = {}) {
  return (
    mergeSx(
      stylex.props(
        styles.menuButton,
        variant === "outline" && menuButtonVariantStyles.outline,
        menuButtonSizeStyles[size],
      ),
      className,
    ).className ?? ""
  );
}

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value2: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // biome-ignore lint/suspicious/noDocumentCookie: shadcn convention
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open2) => !open2)
      : setOpen((open2) => !open2);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          {...mergeSx(stylex.props(styles.provider), className, {
            ...({
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            } as React.CSSProperties),
            ...style,
          })}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        {...mergeSx(stylex.props(styles.sidebarFixed), className, style)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side={side}
          {...mergeSx(stylex.props(styles.sidebarMobileContent), className, {
            ...({
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties),
            ...style,
          })}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div {...stylex.props(styles.sidebarMobileInner)}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  const collapsedAttr = state === "collapsed" ? collapsible : "";

  return (
    <div
      data-collapsible={collapsedAttr}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
      {...stylex.props(styles.sidebarPeer)}
    >
      <div
        data-collapsible={collapsedAttr}
        data-slot="sidebar-gap"
        data-variant={variant}
        {...stylex.props(
          styles.gap,
          (variant === "floating" || variant === "inset") && styles.gapFloating,
        )}
      />
      <div
        data-collapsible={collapsedAttr}
        data-side={side}
        data-slot="sidebar-container"
        data-variant={variant}
        {...mergeSx(
          stylex.props(
            styles.container,
            side === "left" ? styles.containerLeft : styles.containerRight,
            variant === "floating" || variant === "inset"
              ? styles.containerFloating
              : styles.containerBordered,
          ),
          className,
          style,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          data-variant={variant}
          {...stylex.props(styles.inner)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  style,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon"
      variant="ghost"
      {...mergeSx(stylex.props(styles.trigger), className, style)}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({
  className,
  style,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      {...mergeSx(stylex.props(styles.rail), className, style)}
      {...props}
    />
  );
}

function SidebarInset({
  className,
  style,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      {...mergeSx(stylex.props(styles.inset), className, style)}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-sidebar="input"
      data-slot="sidebar-input"
      {...mergeSx(stylex.props(styles.input), className, style)}
      {...props}
    />
  );
}

function SidebarHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="header"
      data-slot="sidebar-header"
      {...mergeSx(stylex.props(styles.section), className, style)}
      {...props}
    />
  );
}

function SidebarFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...mergeSx(stylex.props(styles.section), className, style)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    />
  );
}

function SidebarContent({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="content"
      data-slot="sidebar-content"
      {...mergeSx(stylex.props(styles.content), className, style)}
      {...props}
    />
  );
}

function SidebarGroup({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="group"
      data-slot="sidebar-group"
      {...mergeSx(stylex.props(styles.group), className, style)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...mergeSx(stylex.props(styles.groupLabel), className, style)}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      {...mergeSx(stylex.props(styles.groupAction), className, style)}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...mergeSx(stylex.props(styles.groupContent), className, style)}
      {...props}
    />
  );
}

function SidebarMenu({
  className,
  style,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...mergeSx(stylex.props(styles.menu), className, style)}
      {...props}
    />
  );
}

function SidebarMenuItem({
  className,
  style,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...mergeSx(stylex.props(styles.menuItem), className, style)}
      {...props}
    />
  );
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  style,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      {...mergeSx(
        stylex.props(
          styles.menuButton,
          variant === "outline" && styles.menuButtonOutline,
          menuButtonSizeStyles[size],
        ),
        className,
        style,
      )}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={state !== "collapsed" || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  style,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...mergeSx(
        stylex.props(
          styles.menuAction,
          showOnHover && styles.menuActionHover,
        ),
        className,
        style,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...mergeSx(stylex.props(styles.menuBadge), className, style)}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...mergeSx(stylex.props(styles.menuSkeleton), className, style)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          data-sidebar="menu-skeleton-icon"
          {...stylex.props(styles.menuSkeletonIcon)}
        />
      )}
      <Skeleton
        data-sidebar="menu-skeleton-text"
        {...mergeSx(stylex.props(styles.menuSkeletonText), undefined, {
          maxWidth: width,
        })}
      />
    </div>
  );
}

function SidebarMenuSub({
  className,
  style,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...mergeSx(stylex.props(styles.menuSub), className, style)}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  style,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...mergeSx(stylex.props(styles.menuSubItem), className, style)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  style,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      {...mergeSx(
        stylex.props(
          styles.menuSubButton,
          size === "sm" ? styles.menuSubButtonSm : styles.menuSubButtonMd,
        ),
        className,
        style,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
