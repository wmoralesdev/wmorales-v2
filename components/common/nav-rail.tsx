"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type NavRailItem = {
  href: string;
  label: string;
  exact?: boolean;
};

type CSSVars = React.CSSProperties & Record<`--${string}`, number | string>;

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
      className={cn(
        "relative inline-grid w-full grid-flow-col auto-cols-fr items-stretch rounded-lg bg-muted/20 p-1",
        className,
      )}
      style={{ "--wm-nav-count": items.length } as CSSVars}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1 top-1 h-[calc(100%-0.5rem)] rounded-md bg-accent/20 transition-transform duration-200 ease-out motion-reduce:transition-none",
          showIndicator ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: `calc((100% - 0.5rem) / var(--wm-nav-count))`,
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
            className={cn(
              "relative z-10 inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              isActive
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

