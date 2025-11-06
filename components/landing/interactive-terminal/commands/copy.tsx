"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useTerminalStore } from "@/lib/stores/terminal-store";

function CopyUsage() {
  const t = useTranslations("terminal");
  return <div className="text-muted-foreground text-sm">{t("copyUsage")}</div>;
}

function CopyOutput({ textToCopy }: { textToCopy: string }) {
  const t = useTranslations("terminal");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => setCopied(true))
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  }, [textToCopy]);

  if (copied) {
    return (
      <div className="text-green-600 dark:text-green-400">{t("copied")}</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">{t("copyFailed")}</div>
    );
  }

  return <CopyUsage />;
}

function CopyLastOutput() {
  const t = useTranslations("terminal");
  const { lastOutput } = useTerminalStore();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!lastOutput) {
      setError(true);
      return;
    }

    const textToCopy =
      typeof lastOutput === "string" ? lastOutput : String(lastOutput);

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => setCopied(true))
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  }, [lastOutput]);

  if (copied) {
    return (
      <div className="text-green-600 dark:text-green-400">{t("copied")}</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        {lastOutput ? t("copyFailed") : t("copyNoLastOutput")}
      </div>
    );
  }

  return <div className="text-muted-foreground text-sm">{t("copying")}</div>;
}

export const copyCommand = {
  description: "Copy text to clipboard",
  descriptionKey: "terminal.copyUsage",
  usage: "copy <text> | copy --last",
  category: "system" as const,
  execute: (args?: string[]) => {
    if (!args || args.length === 0) {
      return <CopyUsage />;
    }

    if (args.includes("--last")) {
      return <CopyLastOutput />;
    }

    const textToCopy = args.join(" ");
    return <CopyOutput textToCopy={textToCopy} />;
  },
};
