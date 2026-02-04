"use client";

import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getBlogViewCount, registerBlogView } from "@/app/actions/blog-views";
import { cn } from "@/lib/utils";

type PostViewCountProps = {
  slug: string;
  locale?: string;
  mode?: "register" | "read";
  className?: string;
};

export function PostViewCount({
  slug,
  locale = "en",
  mode = "register",
  className,
}: PostViewCountProps) {
  const [count, setCount] = useState<number | null>(null);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  useEffect(() => {
    if (!slug) return;

    let active = true;
    const action = mode === "read" ? getBlogViewCount : registerBlogView;

    action(slug)
      .then((value) => {
        if (active) setCount(value);
      })
      .catch(() => {
        if (active) setCount(null);
      });

    return () => {
      active = false;
    };
  }, [slug, mode]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/60",
        className,
      )}
    >
      <Eye aria-hidden="true" className="size-3" />
      <span className="tabular-nums">
        {count === null ? "—" : formatter.format(count)}
      </span>
    </span>
  );
}
