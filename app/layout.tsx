import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walter Morales - Software Engineer & Cursor Ambassador",
  description: "Passionate Sr Software Engineer crafting impactful digital solutions. 5+ years experience with .NET, JavaScript, TypeScript, React, and cloud technologies.",
  keywords: ["Walter Morales", "Software Engineer", "Cursor Ambassador", ".NET", "JavaScript", "TypeScript", "React", "NextJS"],
  authors: [{ name: "Walter Morales", url: "https://waltermorales.dev" }],
  creator: "Walter Morales",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Walter Morales - Software Engineer & Cursor Ambassador",
    description: "Passionate Sr Software Engineer crafting impactful digital solutions.",
    siteName: "Walter Morales Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walter Morales - Software Engineer & Cursor Ambassador",
    description: "Passionate Sr Software Engineer crafting impactful digital solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
