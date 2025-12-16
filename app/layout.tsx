import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JetBrains_Mono, Poppins, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--display-family",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--text-family",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--mono-family",
});

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link href="/wm.ico" rel="icon" />
        <link href="/wm.ico" rel="shortcut icon" />
        <link href="/wm.png" rel="apple-touch-icon" />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={cn(
          spaceGrotesk.variable,
          poppins.variable,
          jetbrainsMono.variable,
          "min-h-screen bg-background text-foreground antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
