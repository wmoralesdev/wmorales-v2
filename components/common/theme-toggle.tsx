"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_TRANSITION_DURATION = 400;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ping, setPing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentIsDark = resolvedTheme === "dark";
    const nextTheme = currentIsDark ? "light" : "dark";

    // Trigger ping animation
    setPing(true);

    const motionReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const x = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
    const y = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const r = Math.hypot(maxX, maxY);

    document.documentElement.style.setProperty("--wm-theme-x", `${x}px`);
    document.documentElement.style.setProperty("--wm-theme-y", `${y}px`);
    document.documentElement.style.setProperty("--wm-theme-r", `${r}px`);

    const startViewTransition = (
      document as unknown as { startViewTransition?: (cb: () => void) => void }
    ).startViewTransition?.bind(document);

    if (!motionReduced && typeof startViewTransition === "function") {
      startViewTransition(() => {
        // Ensure the "new" snapshot is captured with the next theme.
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        setTheme(nextTheme);
      });
    } else {
      // Fallback: smooth color transition (no circle)
      document.documentElement.classList.add("theme-transition");
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, THEME_TRANSITION_DURATION);
    }

    // Cleanup
    setTimeout(() => {
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

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative rounded-full text-muted-foreground/70 transition-all duration-200 hover:text-foreground hover:-translate-y-0.5",
        ping && "wm-theme-ping",
      )}
      onClick={toggleTheme}
      ref={buttonRef}
    >
      {isDark ? (
        <Sun className="size-[18px]" />
      ) : (
        <Moon className="size-[18px]" />
      )}
    </button>
  );
}
