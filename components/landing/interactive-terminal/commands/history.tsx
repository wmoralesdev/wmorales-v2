"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useTerminalStore } from "@/lib/stores/terminal-store";

function HistoryOutput({ grepTerm }: { grepTerm?: string }) {
  const t = useTranslations("terminal");
  const { commandHistory } = useTerminalStore();

  const filteredHistory = grepTerm
    ? commandHistory.filter((cmd) =>
        cmd.toLowerCase().includes(grepTerm.toLowerCase())
      )
    : commandHistory;

  return (
    <div className="space-y-1">
      {filteredHistory.length === 0 ? (
        <div className="text-muted-foreground">
          {grepTerm ? t("historyEmpty") : t("historyEmpty")}
        </div>
      ) : (
        <>
          <div className="font-semibold text-green-600 dark:text-green-400">
            {t("historyHeader", { count: filteredHistory.length })}
            {grepTerm && (
              <span className="ml-2 text-muted-foreground text-xs">
                (filtered by: "{grepTerm}")
              </span>
            )}
          </div>
          <div className="ml-4 space-y-0.5 font-mono text-slate-700 text-sm dark:text-gray-300">
            {filteredHistory.map((cmd, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: It's fine to use index as key
              <div key={`${cmd}-${index}`}>
                {filteredHistory.length - index}. {cmd}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HistoryClearOutput() {
  const t = useTranslations("terminal");
  const { clearHistory } = useTerminalStore();

  useEffect(() => {
    clearHistory();
    // Clear localStorage as well
    if (typeof window !== "undefined") {
      localStorage.removeItem("terminal-history");
    }
  }, [clearHistory]);

  return (
    <div className="text-green-600 dark:text-green-400">
      {t("historyCleared")}
    </div>
  );
}

function HistoryExportOutput() {
  const t = useTranslations("terminal");
  const { commandHistory } = useTerminalStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (commandHistory.length === 0) {
      return;
    }

    const historyText = commandHistory
      .map((cmd, index) => `${commandHistory.length - index}. ${cmd}`)
      .join("\n");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(historyText)
        .then(() => setCopied(true))
        .catch(() => {
          // Silent fail
        });
    }
  }, [commandHistory]);

  if (copied) {
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("historyExported")}
      </div>
    );
  }

  return (
    <div className="text-muted-foreground text-sm">{t("historyExporting")}</div>
  );
}

export const historyCommand = {
  description: "Show command history",
  descriptionKey: "terminal.historyUsage",
  usage: "history [-c] [--grep <term>] [--export]",
  category: "system" as const,
  execute: (args?: string[]) => {
    if (args?.includes("-c")) {
      return <HistoryClearOutput />;
    }
    if (args?.includes("--export")) {
      return <HistoryExportOutput />;
    }
    const grepIndex = args?.indexOf("--grep");
    const grepTerm =
      grepIndex !== undefined && grepIndex >= 0 && args && args[grepIndex + 1]
        ? args[grepIndex + 1]
        : undefined;
    return <HistoryOutput grepTerm={grepTerm} />;
  },
};
