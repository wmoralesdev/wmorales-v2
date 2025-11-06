"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function OpenUsage() {
  const t = useTranslations("terminal");
  return <div className="text-muted-foreground text-sm">{t("openUsage")}</div>;
}

function OpenOutput({ target, url }: { target?: string; url?: string }) {
  const t = useTranslations("terminal");
  const router = useRouter();

  if (url) {
    try {
      new URL(url); // Validate URL
      window.open(url, "_blank", "noopener,noreferrer");
      return (
        <div className="text-green-600 dark:text-green-400">
          {t("openNavigating", { target: url })}
        </div>
      );
    } catch {
      return (
        <div className="text-red-600 dark:text-red-400">
          {t("openInvalidUrl")}
        </div>
      );
    }
  }

  if (target === "contact") {
    router.push("/");
    // Navigate to hash after navigation
    setTimeout(() => {
      window.location.hash = "contact";
    }, 0);
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("openNavigating", { target: "contact" })}
      </div>
    );
  }

  if (target === "resume") {
    window.open("/resume.pdf", "_blank");
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("openNavigating", { target: "resume" })}
      </div>
    );
  }

  return <OpenUsage />;
}

export const openCommand = {
  description: "Open a page or URL",
  descriptionKey: "terminal.openUsage",
  usage: "open <contact|resume|url <https://...>>",
  execute: (args?: string[]) => {
    if (!args || args.length === 0) {
      return <OpenUsage />;
    }

    const target = args[0].toLowerCase();

    if (target === "url" && args.length > 1) {
      return <OpenOutput url={args[1]} />;
    }

    return <OpenOutput target={target} />;
  },
};
