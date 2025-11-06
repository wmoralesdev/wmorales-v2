"use client";

import { useTranslations, useLocale } from "next-intl";

function DateOutput() {
  const t = useTranslations("terminal");
  const locale = useLocale();
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(now);

  return (
    <div className="space-y-1">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("dateLabel")}
      </div>
      <div className="ml-4 text-slate-700 dark:text-gray-300">
        {dateStr}
      </div>
    </div>
  );
}

export const dateCommand = {
  description: "Show current date",
  descriptionKey: "terminal.dateUsage",
  usage: "date",
  category: "system" as const,
  execute: () => <DateOutput />,
};

