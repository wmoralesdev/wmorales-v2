"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  title: string;
  level: 1 | 2;
};

type PostTocClientProps = {
  items: TocItem[];
};

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
    <nav
      aria-label="Table of contents"
      className="hidden xl:block fixed right-8 top-32 w-56 pr-safe"
    >
      <p className="mb-3 font-display text-sm font-medium text-muted-foreground">
        Content
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 2 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors",
                item.level === 2 && "text-xs",
                activeId === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80",
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
