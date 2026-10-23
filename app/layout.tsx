import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Public_Sans } from "next/font/google";
import { baseMetadata } from "@/lib/seo";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-big-shoulders",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#614afc",
  colorScheme: "light",
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
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#contenido"
          className="btn sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
