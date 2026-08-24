"use client";

import * as stylex from "@stylexjs/stylex";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getBlogViewCount, registerBlogView } from "@/app/actions/blog-views";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

type PostViewCountProps = {
  slug: string;
  locale?: string;
  mode?: "register" | "read";
  className?: string;
};

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  eye: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
  count: {
    fontVariantNumeric: "tabular-nums",
  },
});

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
    <span {...mergeSx(stylex.props(styles.root), className)}>
      <Eye aria-hidden="true" {...stylex.props(styles.eye)} />
      <span {...stylex.props(styles.count)}>
        {count === null ? "—" : formatter.format(count)}
      </span>
    </span>
  );
}
