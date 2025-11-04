import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JetBrains_Mono, Poppins, Space_Grotesk } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AnimatedMesh } from "@/components/common/animated-mesh";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--display-family",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
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
  // Get locale from next-intl (handled at [locale] level)
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link href="/wm.ico" rel="icon" />
        <link href="/wm.ico" rel="shortcut icon" />
        <link href="/wm.png" rel="apple-touch-icon" />
        {/* Google Calendar Appointment Scheduling */}
        <link
          href="https://calendar.google.com/calendar/scheduling-button-script.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          spaceGrotesk.variable,
          poppins.variable,
          jetbrainsMono.variable,
          "min-h-screen text-foreground antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedMesh />
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
