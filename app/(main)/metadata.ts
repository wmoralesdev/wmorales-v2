import type { Metadata } from 'next';
import { baseMetadata, siteConfig } from '@/lib/metadata';

// Home page uses the default metadata with some additions
export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: '/og-home.png', // Consider creating a specific OG image for home
        width: 1200,
        height: 630,
        alt: 'Walter Morales - Sr Software Engineer & Cursor Ambassador',
      },
    ],
  },
};