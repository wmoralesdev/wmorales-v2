"use client";

import { useLocale, useTranslations } from "next-intl";

function TimeOutput() {
  const t = useTranslations("terminal");
  const locale = useLocale();
  const now = new Date();
  const timeStr = new Intl.DateTimeFormat(locale, {
    timeStyle: "medium",
  }).format(now);

  return (
    <div className="space-y-1">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("timeLabel")}
      </div>
      <div className="ml-4 text-slate-700 dark:text-gray-300">{timeStr}</div>
    </div>
  );
}

export const timeCommand = {
  description: "Show current time",
  descriptionKey: "terminal.timeUsage",
  usage: "time",
  category: "system" as const,
  execute: () => <TimeOutput />,
};
