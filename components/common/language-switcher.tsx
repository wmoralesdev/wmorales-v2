"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setLocale } from "@/app/actions/locale";

const locales = {
  en: "ES",
  es: "EN",
} as const;

export function LanguageSwitcher() {
  const currentLocale = useLocale() as "en" | "es";
  const pathname = usePathname();
  const otherLocale = currentLocale === "en" ? "es" : "en";
  const displayLabel = locales[currentLocale];

  const handleToggle = () => {
    setLocale(otherLocale, pathname);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 font-mono text-xs"
      onClick={handleToggle}
      aria-label={`Switch to ${otherLocale === "en" ? "English" : "Español"}`}
    >
      {displayLabel}
    </Button>
  );
}
