import type { Metadata } from "next";
import QRCode from "qrcode";
import { IntroCard, type QrTarget } from "@/components/intro/intro-card";
import { path } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { vcard } from "@/lib/vcard";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { intro } = await getDictionary();
  return {
    ...pageMetadata(lang, "intro", {
      title: "Intro",
      description: intro.description,
    }),
    robots: { index: false, follow: true },
  };
}

async function qr(text: string) {
  return QRCode.toString(text, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#120d26", light: "#00000000" },
  });
}

const utm = "utm_source=intro-card&utm_medium=qr";

export default async function IntroPage() {
  const t = await getDictionary();
  const lang = t.lang;
  const q = t.intro.qr;
  const site = path(lang, "home");
  const book = path(lang, "book");
  // The cleaned-up URL people see under the QR, without the protocol.
  const bare = (p: string) => `wmorales.dev${p === "/" ? "" : p}`;
  const targets: QrTarget[] = [
    {
      id: "sitio",
      label: q.site,
      caption: bare(site),
      value: `${SITE_URL}${site}?${utm}`,
    },
    {
      id: "agendar",
      label: q.book,
      caption: bare(book),
      value: `${SITE_URL}${book}?${utm}`,
    },
    {
      id: "contacto",
      label: q.contact,
      caption: q.contactCaption,
      value: vcard(lang),
    },
  ];
  const withSvg = await Promise.all(
    targets.map(async (t) => ({ ...t, svg: await qr(t.value) })),
  );
  return (
    <IntroCard
      targets={withSvg}
      vcard={vcard(lang)}
      t={t.intro}
      lang={lang}
      paths={{ site, book, intro: path(lang, "intro") }}
    />
  );
}
