import type { Metadata } from 'next';
import { createMetadata, pageMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: pageMetadata.guestbook.title,
  description: pageMetadata.guestbook.description,
  keywords: pageMetadata.guestbook.keywords,
  openGraph: {
    title: `${pageMetadata.guestbook.title} | ${siteConfig.name}`,
    description: pageMetadata.guestbook.description,
    url: `${siteConfig.url}/guestbook`,
    images: [
      {
        url: '/og-guestbook.png', // Consider creating a specific OG image
        width: 1200,
        height: 630,
        alt: 'Digital Guestbook - Create your AI-generated ticket',
      },
    ],
  },
  twitter: {
    title: `${pageMetadata.guestbook.title} | ${siteConfig.name}`,
    description: pageMetadata.guestbook.description,
    images: ['/og-guestbook.png'],
  },
  alternates: {
    canonical: `${siteConfig.url}/guestbook`,
  },
});
