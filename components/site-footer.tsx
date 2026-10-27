import Link from "next/link";
import { LangLink } from "@/components/lang-link";
import { path, type RouteKey } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { person } from "@/lib/site";

/** `route` is the page being rendered, so the language link lands on its twin. */
export async function SiteFooter({ route }: { route: RouteKey }) {
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
    <footer className="sticky bottom-0 z-0 grid grid-cols-[minmax(0,1fr)] gap-y-16 bg-night px-4 pt-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-snow sm:px-7">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-12 md:gap-x-8">
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-3">
            <h2 className="font-semibold text-[0.9375rem]">{col.title}</h2>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-night-soft">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    l.href.startsWith("http") ? (
                      <a
                        href={l.href}
                        rel="me noopener noreferrer"
                        target="_blank"
                        className="link-underline hover:text-snow"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="link-underline hover:text-snow"
                      >
                        {l.label}
                      </Link>
                    )
                  ) : (
                    l.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-night-soft text-small">
          © {new Date().getFullYear()} Walter Morales · {f.role}
        </p>
        <LangLink
          lang={other}
          href={path(other, route)}
          className="link-underline text-night-soft text-small hover:text-snow"
        >
          {f.language}
        </LangLink>
      </div>
    </footer>
  );
}
