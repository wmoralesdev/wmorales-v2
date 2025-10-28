"use client";

import { useEffect, useState } from "react";

// Constants
const PERCENTAGE_MULTIPLIER = 100;

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * PERCENTAGE_MULTIPLIER;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-800">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
