import { type Locale, path } from "@/lib/i18n/config";
import { aiLabs, person, SITE_URL } from "@/lib/site";

export function vcard(lang: Locale) {
  return [
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
    "END:VCARD",
  ].join("\r\n");
}
