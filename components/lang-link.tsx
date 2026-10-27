"use client";

import type { ComponentProps } from "react";
import { LANG_COOKIE, type Locale } from "@/lib/i18n/config";

/**
 * A link to the same page in another language. It stores the pick so the proxy
 * stops guessing from the browser, and it's a plain anchor on purpose: a prefetch
 * made before the cookie existed could have been redirected back to this language.
 */
export function LangLink({
  lang,
  href,
  onClick,
  ...props
}: ComponentProps<"a"> & { lang: Locale; href: string }) {
  return (
    <a
      {...props}
      href={href}
      hrefLang={lang}
      lang={lang}
      onClick={(e) => {
        // biome-ignore lint/suspicious/noDocumentCookie: one first-party preference cookie, read by proxy.ts.
        document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
        onClick?.(e);
      }}
    />
  );
}
