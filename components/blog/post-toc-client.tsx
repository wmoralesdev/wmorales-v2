"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

export type TocItem = {
  id: string;
  title: string;
  level: 1 | 2;
};

type PostTocClientProps = {
  items: TocItem[];
};

const styles = stylex.create({
  nav: {
    display: "none",
    position: "fixed",
    right: "2rem",
    top: "8rem",
    width: "14rem",
    paddingRight: "env(safe-area-inset-right)",
    "@media (min-width: 1280px)": {
      display: "block",
    },
  },
  heading: {
    marginBottom: "0.75rem",
    fontFamily: fonts.display,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  itemH2: {
    paddingLeft: "0.75rem",
  },
  link: {
    display: "block",
    fontSize: "0.875rem",
    transitionProperty: "color",
    transitionDuration: "150ms",
  },
  linkH2: {
    fontSize: "0.75rem",
  },
  linkActive: {
    color: colors.foreground,
  },
  linkInactive: {
    color: colors.mutedForeground,
    ":hover": {
      color: `color-mix(in oklch, ${colors.foreground}, transparent 20%)`,
    },
  },
});

export function PostTocClient({ items }: PostTocClientProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          // Pick the one closest to the top
          const sorted = intersecting.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => {
      for (const heading of headings) {
        observer.unobserve(heading);
      }
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" {...stylex.props(styles.nav)}>
      <p {...stylex.props(styles.heading)}>Content</p>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => (
          <li
            key={item.id}
            {...stylex.props(item.level === 2 && styles.itemH2)}
          >
            <a
              href={`#${item.id}`}
              {...stylex.props(
                styles.link,
                item.level === 2 && styles.linkH2,
                activeId === item.id ? styles.linkActive : styles.linkInactive,
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
