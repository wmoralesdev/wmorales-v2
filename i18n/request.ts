import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const supportedLocales = ["en", "es"] as const;
const defaultLocale = "en";

function parseAcceptLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q = "1"] = lang.trim().split(";q=");
      return { code: code.split("-")[0].toLowerCase(), quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const lang of languages) {
    if (supportedLocales.includes(lang.code as (typeof supportedLocales)[number])) {
      return lang.code;
    }
  }

  return null;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Try to get locale from cookie first
  let locale = cookieStore.get("wm_locale")?.value;

  // If no cookie, try Accept-Language header
  if (!locale || !supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    const acceptLanguage = headersList.get("accept-language");
    locale = parseAcceptLanguage(acceptLanguage) || defaultLocale;
  }

  // Ensure that a valid locale is used
  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
