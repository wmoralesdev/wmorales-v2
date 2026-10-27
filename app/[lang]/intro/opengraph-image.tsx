import { type Locale, locales } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { ogSize, waterlineOg } from "@/lib/og";

export const alt = "Walter Morales · Ai Labs · MediConecto";
export const size = ogSize;
export const contentType = "image/png";

// Both cards render at build time, like the pages.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const t = dictionaries[(await params).lang];
  return waterlineOg({
    top: "Walter Morales",
    bottom: "Intro",
    note: t.intro.ogNote,
  });
}
