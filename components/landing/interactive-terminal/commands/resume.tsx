"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

function ResumeOutput({ download }: { download: boolean }) {
  const t = useTranslations("terminal");

  useEffect(() => {
    if (download && typeof document !== "undefined") {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "walter-morales-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [download]);

  if (download) {
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("resumeDownloading")}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-slate-700 dark:text-gray-300">
      <div className="font-semibold text-green-600 dark:text-green-400">
        Resume
      </div>
      <div className="mt-2 text-slate-600 text-sm dark:text-gray-400">
        {t("resumeSummary")}
      </div>
    </div>
  );
}

export const resumeCommand = {
  description: "Download my resume",
  descriptionKey: "terminal.resumeUsage",
  usage: "resume [--download]",
  category: "profile" as const,
  execute: (args?: string[]) => {
    const download = args?.includes("--download") ?? false;
    return <ResumeOutput download={download} />;
  },
};
