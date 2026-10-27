// Locale config shared by the proxy, server components and client components, so
// it can't import anything server-only.

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized<T> = Record<Locale, T>;

/** The visitor's explicit pick from the language switch. Beats Accept-Language. */
export const LANG_COOKIE = "lang";

// Public URL of every page in each language. Spanish keeps the unprefixed URLs the
// site has always had; English lives under /en. `folder` is the page's folder under
// app/[lang], which the proxy rewrites to.
export const routes = {
  home: { folder: "", es: "/", en: "/en" },
  book: { folder: "/book", es: "/book", en: "/en/book" },
  intro: { folder: "/intro", es: "/intro", en: "/en/intro" },
  consultant: {
    folder: "/consultor-de-ia",
    es: "/consultor-de-ia",
    en: "/en/ai-consultant",
  },
} as const;

export type RouteKey = keyof typeof routes;

export function path(lang: Locale, key: RouteKey, hash?: string) {
  return hash ? `${routes[key][lang]}#${hash}` : routes[key][lang];
}

/** The page a public pathname belongs to, if any. */
export function matchRoute(
  pathname: string,
): { key: RouteKey; lang: Locale } | null {
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const lang of locales) {
      if (routes[key][lang] === pathname) return { key, lang };
    }
  }
  return null;
}

/** Same page in the other language; unknown paths fall back to its home. */
export function switchPath(pathname: string, to: Locale) {
  const match = matchRoute(pathname);
  return match ? routes[match.key][to] : routes.home[to];
}

/** hreflang map for a page, as Next's `alternates.languages` expects. */
export function languages(key: RouteKey) {
  return {
    es: routes[key].es,
    en: routes[key].en,
    "x-default": routes[key].es,
  };
}

export const ogLocale: Localized<string> = { es: "es_SV", en: "en_US" };
