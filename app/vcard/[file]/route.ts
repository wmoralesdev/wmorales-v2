import { type Locale, locales } from "@/lib/i18n/config";
import { vcard, vcardFiles } from "@/lib/vcard";

// Only the two files below exist; both are rendered at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ file: vcardFiles[lang] }));
}

/**
 * Walter's contact as a file. A plain link to it is the most direct way to save a
 * contact from a phone: iOS opens its "new contact" sheet straight from a
 * text/vcard response, and Android hands the download to Contacts. The name ends
 * in .vcf so proxy.ts leaves it alone.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/vcard/[file]">,
) {
  const { file } = await params;
  const lang = locales.find((l: Locale) => vcardFiles[l] === file);
  if (!lang) return new Response(null, { status: 404 });
  return new Response(vcard(lang, { photo: true }), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
