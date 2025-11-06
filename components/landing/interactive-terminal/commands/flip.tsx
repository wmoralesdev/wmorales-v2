"use client";

import { useTranslations } from "next-intl";

function FlipOutput() {
  const t = useTranslations("terminal");
  const result = Math.random() < 0.5 ? "heads" : "tails";

  return (
    <div className="space-y-1">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("flipResult", { result })}
      </div>
      <div className="font-mono text-2xl">
        {result === "heads" ? "🪙" : "🪙"}
      </div>
      <div className="text-muted-foreground text-sm">
        {result === "heads" ? t("flipHeads") : t("flipTails")}
      </div>
    </div>
  );
}

export const flipCommand = {
  description: "Flip a coin",
  descriptionKey: "terminal.flipUsage",
  usage: "flip",
  category: "fun" as const,
  execute: () => <FlipOutput />,
};

