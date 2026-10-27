import { type NextRequest, NextResponse } from "next/server";
import {
  hasLocale,
  LANG_COOKIE,
  type Locale,
  matchRoute,
  routes,
} from "@/lib/i18n/config";

// Crawlers and link previews always get the URL they asked for. Redirecting them by
// Accept-Language would hide the Spanish pages from any bot that sends "en".
const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|skype|lighthouse/i;

/** Highest-weighted language we support; a visitor who sends neither gets English. */
function fromAcceptLanguage(header: string): Locale {
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((l) => l.q > 0)
    .sort((a, b) => b.q - a.q);
  const hit = ranked.find((l) => hasLocale(l.lang));
  return hit ? (hit.lang as Locale) : "en";
}

function preferred(request: NextRequest): Locale {
  const picked = request.cookies.get(LANG_COOKIE)?.value;
  if (picked && hasLocale(picked)) return picked;
  if (BOT.test(request.headers.get("user-agent") ?? "")) return "es";
  const header = request.headers.get("accept-language");
  return header ? fromAcceptLanguage(header) : "es";
}

function to(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Open Graph and Twitter cards are generated under the locale folder.
  if (/\/(opengraph|twitter)-image(\/|$)/.test(pathname)) return;

  const match = matchRoute(pathname);
  if (match) {
    const { folder } = routes[match.key];
    if (match.lang === "es" && preferred(request) === "en") {
      return NextResponse.redirect(to(request, routes[match.key].en));
    }
    return NextResponse.rewrite(to(request, `/${match.lang}${folder}`));
  }

  const [, first, ...rest] = pathname.split("/");
  const inner = `/${rest.join("/")}`.replace(/\/$/, "");

  // /es/... is the internal path; send people to the public one.
  if (first === "es") {
    return NextResponse.redirect(to(request, inner || "/"), 308);
  }
  // /en/consultor-de-ia and friends: the folder name instead of the English slug.
  if (first === "en") {
    const key = (Object.keys(routes) as (keyof typeof routes)[]).find(
      (k) => routes[k].folder === inner,
    );
    if (key) return NextResponse.redirect(to(request, routes[key].en), 308);
    return;
  }

  // Anything else is a 404; show it in the visitor's language.
  return NextResponse.rewrite(to(request, `/${preferred(request)}${pathname}`));
}

export const config = {
  // Skip Next internals and files with an extension (robots.txt, sitemap.xml,
  // llms.txt, images in /public).
  matcher: ["/((?!_next/|.*\\.[\\w]+$).*)"],
};
