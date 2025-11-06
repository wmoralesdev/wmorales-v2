"use client";

import { useTranslations } from "next-intl";

function CowsayOutput({ text }: { text: string }) {
  const t = useTranslations("terminal");

  if (!text) {
    return (
      <div className="text-muted-foreground text-sm">
        {t("cowsayUsage")}
      </div>
    );
  }

  // Calculate box width (min 20, max 60)
  const boxWidth = Math.max(20, Math.min(60, text.length + 4));

  const topBorder = "─".repeat(boxWidth - 2);
  const paddedText = text.padEnd(boxWidth - 4, " ");

  const cow = `
    \\   ^__^
     \\  (oo)\\_______
        (__)\\       )\\/\\
            ||----w |
            ||     ||
  `.trim();

  return (
    <div className="whitespace-pre font-mono text-xs text-green-600 dark:text-green-400">
      {`┌${topBorder}┐
│ ${paddedText} │
└${topBorder}┘
${cow}`}
    </div>
  );
}

export const cowsayCommand = {
  description: "Display text in a speech bubble",
  descriptionKey: "terminal.cowsayUsage",
  usage: "cowsay <text>",
  category: "fun" as const,
  execute: (args?: string[]) => (
    <CowsayOutput text={args?.join(" ") || ""} />
  ),
};

