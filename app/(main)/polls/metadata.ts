import type { Metadata } from 'next';
import { createMetadata, pageMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: pageMetadata.polls.title,
  description: pageMetadata.polls.description,
  keywords: pageMetadata.polls.keywords,
  openGraph: {
    title: `${pageMetadata.polls.title} | ${siteConfig.name}`,
    description: pageMetadata.polls.description,
    url: `${siteConfig.url}/polls`,
    images: [
      {
        url: '/og-polls.png', // Consider creating a specific OG image
        width: 1200,
        height: 630,
        alt: 'Live Polls - Real-time voting for tech events',
      },
    ],
  },
  twitter: {
    title: `${pageMetadata.polls.title} | ${siteConfig.name}`,
    description: pageMetadata.polls.description,
    images: ['/og-polls.png'],
  },
  alternates: {
    canonical: `${siteConfig.url}/polls`,
  },
});