import { type Locale, type Localized, path } from "@/lib/i18n/config";
import { aiLabs, person, SITE_URL } from "@/lib/site";
import { vcardPhoto } from "@/lib/vcard-photo";

/** Public URL of the downloadable contact file in each language. */
export const vcardFiles: Localized<string> = {
  es: "walter-morales.vcf",
  en: "walter-morales-en.vcf",
};

export const vcardPath = (lang: Locale) => `/vcard/${vcardFiles[lang]}`;

// vCard 3.0 folds long lines: a line break followed by one space continues it.
const fold = (line: string) => line.match(/.{1,74}/g)?.join("\r\n ") ?? line;

/**
 * Walter's contact as a vCard. The QR code carries the lean version, because every
 * extra byte makes the code denser and harder to scan; the file people download
 * adds his photo, so the saved contact has a face.
 */
export function vcard(lang: Locale, { photo = false } = {}) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${person.familyName};${person.givenName};;;`,
    `FN:${person.name}`,
    `ORG:${aiLabs.name}`,
    `TITLE:${person.role}`,
    `EMAIL;TYPE=INTERNET:${person.email}`,
    `URL:${SITE_URL}${lang === "es" ? "" : path(lang, "home")}`,
    `NOTE:${person.roles[lang].join(" · ")}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${person.social.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${person.social.github}`,
    `X-SOCIALPROFILE;TYPE=twitter:${person.social.x}`,
    `ADR;TYPE=WORK:;;;${person.city};;;${person.country}`,
    ...(photo ? [`PHOTO;ENCODING=b;TYPE=JPEG:${vcardPhoto}`] : []),
    "END:VCARD",
  ];
  // Only the file is folded: a QR reader takes the text as it comes.
  return (photo ? lines.map(fold) : lines).join("\r\n");
}
