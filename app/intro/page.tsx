import type { Metadata } from "next";
import QRCode from "qrcode";
import { IntroCard, type QrTarget } from "@/components/intro/intro-card";
import { SITE_URL } from "@/lib/site";
import { vcard } from "@/lib/vcard";

export const metadata: Metadata = {
  title: "Tarjeta de presentación",
  description:
    "Escaneá el código para visitar el sitio de Walter Morales, agendar una llamada o guardar su contacto.",
  alternates: { canonical: "/intro" },
  robots: { index: false, follow: true },
};

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
  const targets: QrTarget[] = [
    {
      id: "sitio",
      label: "Sitio",
      caption: "wmorales.dev",
      value: `${SITE_URL}/?${utm}`,
    },
    {
      id: "agendar",
      label: "Agendar",
      caption: "wmorales.dev/book",
      value: `${SITE_URL}/book?${utm}`,
    },
    {
      id: "contacto",
      label: "Contacto",
      caption: "Guarda mi contacto en tu teléfono",
      value: vcard(),
    },
  ];
  const withSvg = await Promise.all(
    targets.map(async (t) => ({ ...t, svg: await qr(t.value) })),
  );
  return <IntroCard targets={withSvg} vcard={vcard()} />;
}
