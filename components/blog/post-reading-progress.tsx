"use client";

import { useEffect, useState } from "react";

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
    <div className="fixed top-0 left-0 z-50 h-0.5 w-full bg-border/30">
      <div
        aria-hidden="true"
        className="h-full bg-accent transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
