"use client";

import { useTranslations } from "next-intl";

function RollOutput({ sides }: { sides: number }) {
  const t = useTranslations("terminal");
  const result = Math.floor(Math.random() * sides) + 1;

  return (
    <div className="space-y-1">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("rollResult", { result, sides })}
      </div>
      <div className="font-mono text-2xl text-cyan-600 dark:text-cyan-400">
        {result}
      </div>
    </div>
  );
}

export const rollCommand = {
  description: "Roll a die",
  descriptionKey: "terminal.rollUsage",
  usage: "roll <d6|d20|d100>",
  category: "fun" as const,
  execute: (args?: string[]) => {
    const dieType = args?.[0]?.toLowerCase() || "d6";

    let sides = 6;
    if (dieType === "d20") {
      sides = 20;
    } else if (dieType === "d100") {
      sides = 100;
    } else if (dieType.startsWith("d")) {
      const parsed = Number.parseInt(dieType.slice(1), 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 1000) {
        sides = parsed;
      }
    }

    return <RollOutput sides={sides} />;
  },
};

