"use client";

import * as stylex from "@stylexjs/stylex";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { icon } from "@/lib/stylex/icons";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const THEME_TRANSITION_DURATION = 400;

const styles = stylex.create({
  button: {
    position: "relative",
    borderRadius: "9999px",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
    transitionProperty: "color, transform",
    transitionDuration: "200ms",
    ":hover": {
      color: colors.foreground,
      transform: "translateY(-0.125rem)",
    },
  },
});

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

    setPing(true);

    const motionReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const x = buttonRect
      ? buttonRect.left + buttonRect.width / 2
      : window.innerWidth / 2;
    const y = buttonRect
      ? buttonRect.top + buttonRect.height / 2
      : window.innerHeight / 2;
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
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        setTheme(nextTheme);
      });
    } else {
      document.documentElement.classList.add("theme-transition");
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, THEME_TRANSITION_DURATION);
    }

    setTimeout(() => {
      setPing(false);
    }, THEME_TRANSITION_DURATION);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        {...stylex.props(styles.button)}
      >
        <Moon {...stylex.props(icon.lg)} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      {...mergeSx(stylex.props(styles.button), ping ? "wm-theme-ping" : undefined)}
      onClick={toggleTheme}
      ref={buttonRef}
    >
      {isDark ? (
        <Sun {...stylex.props(icon.lg)} />
      ) : (
        <Moon {...stylex.props(icon.lg)} />
      )}
    </button>
  );
}
