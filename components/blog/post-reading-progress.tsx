"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  track: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: "0.125rem",
    backgroundColor: `color-mix(in oklch, ${colors.border}, transparent 70%)`,
    paddingTop: "env(safe-area-inset-top)",
  },
  bar: {
    height: "100%",
    backgroundColor: colors.accent,
    transitionProperty: "width",
    transitionDuration: "150ms",
  },
});

export function PostReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = articleHeight - windowHeight;
      const scrolled = Math.max(
        0,
        Math.min(scrollTop - articleTop, totalScrollable),
      );

      const progressPercent =
        totalScrollable > 0
          ? Math.min(100, (scrolled / totalScrollable) * 100)
          : 0;

      setProgress(progressPercent);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div {...stylex.props(styles.track)}>
      <div
        aria-hidden="true"
        {...mergeSx(stylex.props(styles.bar), undefined, {
          width: `${progress}%`,
        })}
      />
    </div>
  );
}
