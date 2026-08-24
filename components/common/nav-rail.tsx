"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

type NavRailItem = {
  href: string;
  label: string;
  exact?: boolean;
};

type CSSVars = React.CSSProperties & Record<`--${string}`, number | string>;

const styles = stylex.create({
  nav: {
    position: "relative",
    display: "inline-grid",
    width: "100%",
    gridAutoFlow: "column",
    gridAutoColumns: "1fr",
    alignItems: "stretch",
    borderRadius: radii.lg,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 80%)`,
    padding: "0.25rem",
  },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    left: "0.25rem",
    top: "0.25rem",
    height: "calc(100% - 0.5rem)",
    borderRadius: radii.md,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    transitionProperty: "transform, opacity",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-out",
    "@media (prefers-reduced-motion: reduce)": {
      transitionProperty: "none",
    },
  },
  indicatorVisible: {
    opacity: 1,
  },
  indicatorHidden: {
    opacity: 0,
  },
  link: {
    position: "relative",
    zIndex: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    paddingInline: "0.75rem",
    paddingBlock: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 1px ${colors.ring}`,
    },
  },
  active: {
    color: colors.accent,
  },
  inactive: {
    color: colors.mutedForeground,
    ":hover": {
      color: colors.foreground,
    },
  },
});

export function NavRail({
  items,
  className,
  ariaLabel = "Primary navigation",
}: {
  items: NavRailItem[];
  className?: string;
  ariaLabel?: string;
}) {
  const pathname = usePathname();

  const activeIndex = useMemo(() => {
    const idx = items.findIndex((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href),
    );
    return idx;
  }, [items, pathname]);

  const clampedIndex = activeIndex < 0 ? 0 : activeIndex;
  const showIndicator = activeIndex >= 0 && items.length > 0;

  return (
    <nav
      aria-label={ariaLabel}
      {...mergeSx(stylex.props(styles.nav), className)}
      style={{ "--wm-nav-count": items.length } as CSSVars}
    >
      <span
        aria-hidden="true"
        {...stylex.props(
          styles.indicator,
          showIndicator ? styles.indicatorVisible : styles.indicatorHidden,
        )}
        style={{
          width: "calc((100% - 0.5rem) / var(--wm-nav-count))",
          transform: `translateX(${clampedIndex * 100}%)`,
        }}
      />

      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            {...stylex.props(
              styles.link,
              isActive ? styles.active : styles.inactive,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
