import { aiLabs, person, SITE_URL } from "@/lib/site";

export function vcard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${person.familyName};${person.givenName};;;`,
    `FN:${person.name}`,
    `ORG:${aiLabs.name}`,
    `TITLE:${person.role}`,
    `EMAIL;TYPE=INTERNET:${person.email}`,
    `URL:${SITE_URL}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${person.social.linkedin}`,
    `ADR;TYPE=WORK:;;;${person.city};;;${person.country}`,
    "END:VCARD",
  ].join("\r\n");
}
