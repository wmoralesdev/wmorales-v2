import type { Metadata } from 'next';
import { createMetadata, pageMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: pageMetadata.cursor.title,
  description: pageMetadata.cursor.description,
  keywords: pageMetadata.cursor.keywords,
  openGraph: {
    title: `${pageMetadata.cursor.title} | ${siteConfig.name}`,
    description: pageMetadata.cursor.description,
    url: `${siteConfig.url}/cursor`,
    images: [
      {
        url: '/og-cursor.png', // Consider creating a specific OG image for this page
        width: 1200,
        height: 630,
        alt: 'Walter Morales - First Cursor Ambassador from El Salvador',
      },
    ],
  },
  twitter: {
    title: `${pageMetadata.cursor.title} | ${siteConfig.name}`,
    description: pageMetadata.cursor.description,
    images: ['/og-cursor.png'],
  },
  alternates: {
    canonical: `${siteConfig.url}/cursor`,
  },
});