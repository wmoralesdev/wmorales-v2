"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_TRANSITION_DURATION = 400;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = theme === "dark";

    // Add transition class to html element for smooth color change
    document.documentElement.classList.add("theme-transition");

    // Trigger ping animation
    setPing(true);

    // Switch theme
    setTheme(isDark ? "light" : "dark");

    // Cleanup
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
      setPing(false);
    }, THEME_TRANSITION_DURATION);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        <Moon className="size-[18px]" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative rounded-full text-muted-foreground/70 transition-colors hover:text-foreground",
        ping && "wm-theme-ping",
      )}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-[18px]" />
      ) : (
        <Moon className="size-[18px]" />
      )}
    </button>
  );
}
