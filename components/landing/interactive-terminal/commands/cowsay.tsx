"use client";

import { useTranslations } from "next-intl";

const MIN_BOX_WIDTH = 20;
const MAX_BOX_WIDTH = 60;
const PADDING_OFFSET = 4;
const BORDER_OFFSET = 2;

function CowsayOutput({ text }: { text: string }) {
  const t = useTranslations("terminal");

  if (!text) {
    return (
      <div className="text-muted-foreground text-sm">{t("cowsayUsage")}</div>
    );
  }

  // Calculate box width (min 20, max 60)
  const boxWidth = Math.max(
    MIN_BOX_WIDTH,
    Math.min(MAX_BOX_WIDTH, text.length + PADDING_OFFSET)
  );

  const topBorder = "─".repeat(boxWidth - BORDER_OFFSET);
  const paddedText = text.padEnd(boxWidth - PADDING_OFFSET, " ");

  const cow = `
    \\   ^__^
     \\  (oo)\\_______
        (__)\\       )\\/\\
            ||----w |
            ||     ||
  `.trim();

  return (
    <div className="whitespace-pre font-mono text-green-600 text-xs dark:text-green-400">
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
  execute: (args?: string[]) => <CowsayOutput text={args?.join(" ") || ""} />,
};
