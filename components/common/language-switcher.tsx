"use client";

import * as stylex from "@stylexjs/stylex";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { setLocale } from "@/app/actions/locale";
import { Button } from "@/components/ui/button";
import { fonts } from "@/lib/stylex/tokens.stylex";

const locales = {
  en: "ES",
  es: "EN",
} as const;

const styles = stylex.create({
  button: {
    height: "2rem",
    paddingInline: "0.5rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    transitionProperty: "transform",
    transitionDuration: "200ms",
    ":hover": {
      transform: "translateY(-0.125rem)",
    },
  },
});

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
      className={stylex.props(styles.button).className}
      onClick={handleToggle}
      aria-label={`Switch to ${otherLocale === "en" ? "English" : "Español"}`}
    >
      {displayLabel}
    </Button>
  );
}
