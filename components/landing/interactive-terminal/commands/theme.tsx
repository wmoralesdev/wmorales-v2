"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useTheme } from "next-themes";

function ThemeOutput({ mode }: { mode?: string }) {
  const t = useTranslations("terminal");
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (mode === "dark") {
      setTheme("dark");
    } else if (mode === "light") {
      setTheme("light");
    } else if (mode === "toggle") {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [mode, setTheme, theme]);

  if (mode === "dark" || mode === "light" || mode === "toggle") {
    return (
      <div className="text-green-600 dark:text-green-400">
        {mode === "toggle"
          ? `Theme toggled to ${theme === "dark" ? "light" : "dark"}`
          : `Theme set to ${mode}`}
      </div>
    );
  }

  return (
    <div className="text-slate-700 dark:text-gray-300">
      <div className="font-semibold text-green-600 dark:text-green-400">
        Theme Toggle
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400">
        Current theme: {theme || "system"}
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400">
        {t("themeUsage")}
      </div>
    </div>
  );
}

export const themeCommand = {
  description: "Toggle terminal theme",
  descriptionKey: "terminal.themeUsage",
  usage: "theme [dark|light|toggle]",
  category: "system" as const,
  execute: (args?: string[]) => {
    return <ThemeOutput mode={args?.[0]} />;
  },
};
