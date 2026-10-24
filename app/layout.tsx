import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToolsPanel } from "@/components/tools-panel";
import { prefsScript } from "@/lib/prefs";
import { baseMetadata } from "@/lib/seo";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
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
    <html lang="es" className={sans.variable} suppressHydrationWarning>
      <head>
        {/* Applies saved Tools prefs before first paint. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static string built in lib/prefs.ts, no user input.
          dangerouslySetInnerHTML={{ __html: prefsScript }}
        />
      </head>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#contenido"
          className="btn sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Saltar al contenido
        </a>
        {children}
        <ToolsPanel />
      </body>
    </html>
  );
}
