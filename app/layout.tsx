import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';
import { Space_Grotesk, Poppins, Geist_Mono } from 'next/font/google';

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--display-family',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--text-family',
});

const gesit_mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--mono-family',
});

export const metadata: Metadata = {
  title: 'Walter Morales - Software Engineer & Cursor Ambassador',
  description:
    'Passionate Sr Software Engineer crafting impactful digital solutions. 5+ years experience with .NET, JavaScript, TypeScript, React, and cloud technologies.',
  keywords: [
    'Walter Morales',
    'Software Engineer',
    'Cursor Ambassador',
    '.NET',
    'JavaScript',
    'TypeScript',
    'React',
    'NextJS',
  ],
  authors: [{ name: 'Walter Morales', url: 'https://waltermorales.dev' }],
  creator: 'Walter Morales',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Walter Morales - Software Engineer & Cursor Ambassador',
    description: 'Passionate Sr Software Engineer crafting impactful digital solutions.',
    siteName: 'Walter Morales Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Walter Morales - Software Engineer & Cursor Ambassador',
    description: 'Passionate Sr Software Engineer crafting impactful digital solutions.',
  },
  icons: {
    icon: '/wm.ico',
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
        className={cn(
          space_grotesk.variable,
          poppins.variable,
          gesit_mono.variable,
          'min-h-screen bg-background text-foreground antialiased'
        )}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
