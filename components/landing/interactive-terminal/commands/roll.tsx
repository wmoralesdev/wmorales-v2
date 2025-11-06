"use client";

import { useTranslations } from "next-intl";

const DEFAULT_DIE_SIDES = 6;
const D20_SIDES = 20;
const D100_SIDES = 100;
const MAX_DIE_SIDES = 1000;

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

    let sides = DEFAULT_DIE_SIDES;
    if (dieType === "d20") {
      sides = D20_SIDES;
    } else if (dieType === "d100") {
      sides = D100_SIDES;
    } else if (dieType.startsWith("d")) {
      const parsed = Number.parseInt(dieType.slice(1), 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= MAX_DIE_SIDES) {
        sides = parsed;
      }
    }

    return <RollOutput sides={sides} />;
  },
};
