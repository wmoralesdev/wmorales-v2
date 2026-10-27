import "../globals.css";

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ToolsPanel } from "@/components/tools-panel";
import { locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { baseMetadata } from "@/lib/seo";
import { themeScript } from "@/lib/theme";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  // Variable font, so the hero's weight wave animates smoothly.
  variable: "--font-jakarta",
  display: "swap",
});

// Spanish is served at /, English at /en; proxy.ts maps public URLs onto these.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata(await getLocale());
}

export const viewport: Viewport = {
  themeColor: "#614afc",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getDictionary();
  return (
    // The theme script sets data-theme before React hydrates.
    <html lang={t.lang} className={sans.variable} suppressHydrationWarning>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#contenido"
          className="btn sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          {t.skip}
        </a>
        {children}
        <ToolsPanel lang={t.lang} t={t.tools} />
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </body>
    </html>
  );
}
