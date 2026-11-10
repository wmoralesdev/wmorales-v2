import Link from "next/link";
import { LangLink } from "@/components/lang-link";
import { path, type RouteKey } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { person } from "@/lib/site";

// Every row is 36px tall on phones: enough for a thumb, without the footer
// taking a whole screen. Compact again from md, where a pointer does the work.
// The underline sits on the label, not on the taller box.
const row = "flex min-h-9 items-center md:min-h-0";
const tap = "inline-flex min-h-9 items-center hover:text-snow md:min-h-0";

/**
 * `route` is the page being rendered, so the language link lands on its twin.
 * `bar` leaves room under the footer for a page's fixed action bar on phones.
 */
export async function SiteFooter({
  route,
  bar = false,
}: {
  route: RouteKey;
  bar?: boolean;
}) {
  const t = await getDictionary();
  const f = t.footer;
  const other = t.lang === "es" ? "en" : "es";
  const columns: {
    title: string;
    links: { label: string; href?: string }[];
  }[] = [
    {
      title: f.contact,
      links: [
        { label: person.email, href: `mailto:${person.email}` },
        { label: t.bookCall, href: path(t.lang, "book") },
      ],
    },
    {
      title: f.site,
      links: [
        { label: t.meta.home, href: path(t.lang, "home") },
        { label: f.experience, href: path(t.lang, "home", "trayectoria") },
        { label: f.intro, href: path(t.lang, "intro") },
      ],
    },
    {
      title: f.social,
      links: [
        { label: "LinkedIn", href: person.social.linkedin },
        { label: "GitHub", href: person.social.github },
        { label: "X", href: person.social.x },
        { label: "Instagram", href: person.social.instagram },
      ],
    },
    {
      title: f.from,
      links: [
        { label: "San Salvador" },
        { label: "El Salvador" },
        { label: f.remote },
      ],
    },
  ];

  return (
    <footer
      className={`sticky bottom-0 z-0 grid grid-cols-[minmax(0,1fr)] gap-y-8 bg-night px-4 pt-8 text-small text-snow sm:px-7 md:gap-y-12 md:pt-10 ${
        bar
          ? "pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.75rem))] lg:pb-5"
          : "pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      }`}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-12 md:gap-x-8">
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-3">
            <h2 className="font-semibold">{col.title}</h2>
            <ul className="mt-1 text-night-soft md:mt-2 md:space-y-1.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    l.href.startsWith("http") ? (
                      <a
                        href={l.href}
                        rel="me noopener noreferrer"
                        target="_blank"
                        className={tap}
                      >
                        <span className="link-underline">{l.label}</span>
                      </a>
                    ) : (
                      <Link href={l.href} className={tap}>
                        <span className="link-underline">{l.label}</span>
                      </Link>
                    )
                  ) : (
                    <span className={row}>{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* The right end stays clear of the Tools button, which sits on this corner. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 pr-16 md:pr-20">
        <p className="text-night-soft">
          © {new Date().getFullYear()} Walter Morales
          {/* The role would wrap the row on phones; the page already says it. */}
          <span className="max-sm:hidden"> · {f.role}</span>
        </p>
        <LangLink
          lang={other}
          href={path(other, route)}
          className={`${tap} text-night-soft`}
        >
          <span className="link-underline">{f.language}</span>
        </LangLink>
      </div>
    </footer>
  );
}
