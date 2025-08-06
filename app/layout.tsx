import './globals.css';

import { JetBrains_Mono, Poppins, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import { AnimatedMesh } from '@/components/common/animated-mesh';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--display-family',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--text-family',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--mono-family',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  // Extract locale from URL params
  const { locale } = await params;

  return (
    <html className="dark" lang={locale}>
      <head>
        <link rel="icon" href="/wm.ico" />
        <link rel="shortcut icon" href="/wm.ico" />
        <link rel="apple-touch-icon" href="/wm.png" />
      </head>
      <body
        className={cn(
          spaceGrotesk.variable,
          poppins.variable,
          jetbrainsMono.variable,
          'min-h-screen text-foreground antialiased'
        )}
      >
        <AnimatedMesh />
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
