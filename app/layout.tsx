import './globals.css';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import { baseMetadata } from '@/lib/metadata';
import { cn } from '@/lib/utils';
import { Space_Grotesk, Poppins, Geist_Mono } from 'next/font/google';
import { AnimatedMesh } from '@/components/common/animated-mesh';

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

export const metadata = baseMetadata;

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
          'min-h-screen text-foreground antialiased'
        )}
      >
        <AnimatedMesh />
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
