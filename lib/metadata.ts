import type { Metadata } from 'next';

// Site configuration
export const siteConfig = {
  name: 'Walter Morales',
  title: 'Walter Morales - Sr Software Engineer & Cursor Ambassador',
  shortTitle: 'Walter Morales',
  description:
    'Sr Software Engineer and pioneering Cursor Ambassador from El Salvador. Building impactful digital solutions with 5+ years of experience in .NET, JavaScript, TypeScript, React, and cloud technologies.',
  shortDescription: 'Sr Software Engineer & Cursor Ambassador from El Salvador',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://waltermorales.dev',
  ogImage: '/og-image.png', // You should create this
  author: {
    name: 'Walter Morales',
    email: 'walterrafael26@gmail.com',
    linkedin: 'https://linkedin.com/in/wmoralesdev',
    github: 'https://github.com/wmoralesdev',
    instagram: 'https://instagram.com/wmorales.dev',
  },
  keywords: [
    'Walter Morales',
    'Software Engineer',
    'Cursor Ambassador',
    'El Salvador',
    'Central America',
    'LATAM',
    '.NET Developer',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Cloud Technologies',
    'AI Development',
    'Full Stack Developer',
    'Tech Community',
    'Southworks',
  ],
  creator: 'Walter Morales',
  locale: 'en_US',
};

// Base metadata template
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortTitle}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@wmoralesdev', // Add your Twitter handle
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/wm.ico',
    shortcut: '/wm.ico',
    apple: '/wm.png',
  },
  manifest: '/manifest.json', // Consider creating this
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Utility function to merge metadata
export function createMetadata(override: Metadata): Metadata {
  return {
    ...baseMetadata,
    ...override,
    openGraph: {
      ...baseMetadata.openGraph,
      ...override.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...override.twitter,
    },
  };
}

// Page-specific metadata templates
export const pageMetadata = {
  cursor: {
    title: 'Cursor Ambassador',
    description:
      'First Cursor Ambassador from El Salvador. Pioneering AI-powered development in Central America, building communities, and helping teams accelerate with Cursor IDE.',
    keywords: [
      'Cursor Ambassador',
      'Cursor IDE',
      'AI Development',
      'El Salvador Tech',
      'LATAM Developer Community',
      'AI-powered coding',
      'Tab Completion',
      'Inline Edit',
      'Agentic Prompts',
      'Developer Training',
      'Tech Consultancy',
    ],
  },
  guestbook: {
    title: 'Digital Guestbook',
    description:
      'Sign my digital guestbook and create your unique conference-style ticket with AI-generated colors based on your mood. Join the community of developers and tech enthusiasts.',
    keywords: ['Digital Guestbook', 'AI Tickets', 'Developer Community', 'Interactive Experience'],
  },
  surveys: {
    title: 'Community Surveys',
    description:
      'Participate in surveys to help shape the future of the LATAM Cursor community. Your voice matters in building a stronger developer ecosystem in Latin America.',
    keywords: ['Community Surveys', 'LATAM Tech', 'Developer Feedback', 'Cursor Community', 'Tech Polls'],
  },
  polls: {
    title: 'Live Polls',
    description:
      'Join live polls and vote with fellow developers in real-time. Interactive polling for tech events, workshops, and community decisions.',
    keywords: ['Live Polls', 'Real-time Voting', 'Tech Events', 'Developer Community', 'Interactive Polls'],
  },
};

// Structured data generators
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: siteConfig.author.email,
    sameAs: [siteConfig.author.linkedin, siteConfig.author.github, siteConfig.author.instagram],
    jobTitle: 'Senior Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Southworks',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Universidad Don Bosco',
    },
    knowsAbout: siteConfig.keywords,
    nationality: {
      '@type': 'Country',
      name: 'El Salvador',
    },
  };
}

export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}