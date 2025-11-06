"use client";

import { useTranslations, useLocale } from "next-intl";

function NowOutput() {
  const t = useTranslations("terminal");
  const locale = useLocale();
  const now = new Date();
  const dateTimeStr = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(now);

  return (
    <div className="space-y-1">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("nowLabel")}
      </div>
      <div className="ml-4 text-slate-700 dark:text-gray-300">
        {dateTimeStr}
      </div>
    </div>
  );
}

export const nowCommand = {
  description: "Show current date and time",
  descriptionKey: "terminal.nowUsage",
  usage: "now",
  category: "system" as const,
  execute: () => <NowOutput />,
};

