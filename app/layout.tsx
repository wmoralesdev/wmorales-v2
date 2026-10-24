import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ToolsPanel } from "@/components/tools-panel";
import { baseMetadata } from "@/lib/seo";
import { themeScript } from "@/lib/theme";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  // Variable font, so the hero's weight wave animates smoothly.
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#614afc",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The theme script sets data-theme before React hydrates.
    <html lang="es" className={sans.variable} suppressHydrationWarning>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#contenido"
          className="btn sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Saltar al contenido
        </a>
        {children}
        <ToolsPanel />
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </body>
    </html>
  );
}
