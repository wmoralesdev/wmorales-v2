"use client";

import { useTranslations } from "next-intl";
import { socialsCommand } from "./socials";

function WhoamiOutput({ showLinks }: { showLinks: boolean }) {
  const t = useTranslations("terminal");

  return (
    <div className="space-y-2">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("whoamiTitle")}
      </div>
      <div className="ml-4 text-slate-700 dark:text-gray-300">
        {t("whoamiSubtitle")}
      </div>
      {showLinks && (
        <div className="mt-3 ml-4">
          <div className="mb-2 font-semibold text-green-600 dark:text-green-400">
            {t("socialsTitle")}
          </div>
          {socialsCommand.execute()}
        </div>
      )}
    </div>
  );
}

export const whoamiCommand = {
  description: "Display current user information",
  descriptionKey: "terminal.whoamiUsage",
  usage: "whoami [--links]",
  category: "profile" as const,
  execute: (args?: string[]) => {
    const showLinks = args?.includes("--links") ?? false;
    return <WhoamiOutput showLinks={showLinks} />;
  },
};
