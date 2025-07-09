import type { Metadata } from 'next';
import { createMetadata, pageMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: pageMetadata.surveys.title,
  description: pageMetadata.surveys.description,
  keywords: pageMetadata.surveys.keywords,
  openGraph: {
    title: `${pageMetadata.surveys.title} | ${siteConfig.name}`,
    description: pageMetadata.surveys.description,
    url: `${siteConfig.url}/surveys`,
    images: [
      {
        url: '/og-surveys.png', // Consider creating a specific OG image
        width: 1200,
        height: 630,
        alt: 'Community Surveys - Shape the future of LATAM Cursor community',
      },
    ],
  },
  twitter: {
    title: `${pageMetadata.surveys.title} | ${siteConfig.name}`,
    description: pageMetadata.surveys.description,
    images: ['/og-surveys.png'],
  },
  alternates: {
    canonical: `${siteConfig.url}/surveys`,
  },
});