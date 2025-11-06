"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

function LangOutput({ targetLocale }: { targetLocale?: string }) {
  const t = useTranslations("terminal");
  const locale = useLocale();

  const validLocales = ["en", "es"];
  const target = targetLocale?.toLowerCase();

  useEffect(() => {
    if (!target || !validLocales.includes(target)) {
      return;
    }

    if (target === locale) {
      return;
    }

    // Switch locale
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/").filter(Boolean);

    // Remove the current locale from path segments if it exists
    if (pathSegments.length > 0 && validLocales.includes(pathSegments[0] || "")) {
      pathSegments.shift();
    }

    // Handle root path
    const pathWithoutLocale = pathSegments.length > 0 ? pathSegments.join("/") : "";
    const newPath = pathWithoutLocale ? `/${target}/${pathWithoutLocale}` : `/${target}`;

    // Add search parameters if they exist
    const searchParams = currentUrl.searchParams.toString();
    const fullUrl = searchParams ? `${newPath}?${searchParams}` : newPath;

    // Use window.location.href for direct navigation (causes full page reload)
    window.location.href = fullUrl;
  }, [target, locale, validLocales]);

  if (!target || !validLocales.includes(target)) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 dark:text-red-400">
          {t("langInvalid", { locale: targetLocale || "" })}
        </div>
        <div className="text-muted-foreground text-sm">
          {t("langUsage")}
        </div>
        <div className="text-muted-foreground text-sm">
          {t("langCurrent", { locale })}
        </div>
      </div>
    );
  }

  if (target === locale) {
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("langAlreadySet", { locale: target })}
      </div>
    );
  }

  return (
    <div className="text-green-600 dark:text-green-400">
      {t("langSwitching", { locale: target })}
    </div>
  );
}

export const langCommand = {
  description: "Switch language",
  descriptionKey: "terminal.langUsage",
  usage: "lang <en|es>",
  category: "system" as const,
  execute: (args?: string[]) => <LangOutput targetLocale={args?.[0]} />,
};

