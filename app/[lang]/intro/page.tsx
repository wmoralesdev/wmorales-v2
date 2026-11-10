import type { Metadata } from "next";
import QRCode from "qrcode";
import { IntroCard } from "@/components/intro/intro-card";
import type { QrTarget } from "@/components/intro/qr-panel";
import { SiteFooter } from "@/components/site-footer";
import { path } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { vcard, vcardPath } from "@/lib/vcard";

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
  const intro = path(lang, "intro");
  // The cleaned-up URL people see under the QR, without the protocol.
  const bare = (p: string) => `wmorales.dev${p === "/" ? "" : p}`;
  // The card itself comes first: it's what Walter shows across a table, and what
  // someone who already has it shows the person next to them.
  const targets: QrTarget[] = [
    {
      id: "tarjeta",
      label: q.card,
      caption: bare(intro),
      value: `${SITE_URL}${intro}?${utm}`,
    },
    {
      id: "contacto",
      label: q.contact,
      caption: q.contactCaption,
      value: vcard(lang),
    },
    {
      id: "agendar",
      label: q.book,
      caption: bare(book),
      value: `${SITE_URL}${book}?${utm}`,
    },
  ];
  const withSvg = await Promise.all(
    targets.map(async (t) => ({ ...t, svg: await qr(t.value) })),
  );
  return (
    <>
      <IntroCard
        targets={withSvg}
        vcf={vcardPath(lang)}
        t={t.intro}
        lang={lang}
        paths={{ site, book, intro }}
      />
      <SiteFooter route="intro" bar />
    </>
  );
}
