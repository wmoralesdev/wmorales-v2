import Link from "next/link";
import { HalftoneIcon } from "@/components/halftone-icon";
import { SiteHeader } from "@/components/site-header";
import { path } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getDictionary();
  return (
    <main id="contenido" className="flex min-h-svh flex-col bg-paper">
      <SiteHeader
        home={path(t.lang, "home")}
        action={{ href: path(t.lang, "book"), label: t.bookCall }}
      />
      <div className="flex flex-1 flex-col justify-center px-4 pb-16 sm:px-7">
        <HalftoneIcon
          shape={["ring", "plus", "sparkle", "dot"]}
          grid={11}
          motion="morph"
          className="mb-8 size-28 text-accent"
        />
        <h1 className="display text-[clamp(4rem,20vw,13rem)] text-accent">
          404
        </h1>
        <p className="mt-4 max-w-[32rem] text-lead">{t.notFound.body}</p>
        <Link href={path(t.lang, "home")} className="btn mt-8 self-start">
          {t.notFound.cta}
        </Link>
      </div>
    </main>
  );
}
