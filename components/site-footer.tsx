import Link from "next/link";
import { person } from "@/lib/site";

const columns = [
  {
    title: "Contacto",
    links: [
      { label: person.email, href: `mailto:${person.email}` },
      { label: "Agendar llamada", href: "/book" },
    ],
  },
  {
    title: "Sitio",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Experiencia", href: "/#trayectoria" },
      { label: "Tarjeta de presentación", href: "/intro" },
    ],
  },
  {
    title: "Redes",
    links: [
      { label: "LinkedIn", href: person.social.linkedin },
      { label: "GitHub", href: person.social.github },
      { label: "X", href: person.social.x },
      { label: "Instagram", href: person.social.instagram },
    ],
  },
  {
    title: "Desde",
    links: [
      { label: "San Salvador" },
      { label: "El Salvador" },
      { label: "Remoto para Latinoamérica y EE. UU." },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="sticky bottom-0 z-0 grid grid-cols-[minmax(0,1fr)] gap-y-16 bg-night px-4 pt-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-snow sm:px-7">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-12 md:gap-x-8">
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-3">
            <h2 className="font-semibold text-[0.9375rem]">{col.title}</h2>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-night-soft">
              {col.links.map((l) => (
                <li key={l.label}>
                  {"href" in l ? (
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
      <div>
        <p className="text-night-soft text-small">
          © {new Date().getFullYear()} Walter Morales · Co-Founder de Ai Labs
        </p>
      </div>
    </footer>
  );
}
