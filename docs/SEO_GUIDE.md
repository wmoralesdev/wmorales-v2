# SEO & Metadata Guide

This guide explains the centralized SEO and metadata system implemented in this Next.js application.

## Overview

The application uses a hierarchical metadata system where:

- Common metadata is defined at the app level (`app/layout.tsx`)
- Page-specific metadata extends the base configuration
- Dynamic pages generate metadata based on content

## Structure

### 1. Centralized Configuration (`/lib/metadata.ts`)

The main configuration file contains:

- **Site Configuration**: Basic site information (name, URL, author details)
- **Base Metadata**: Default metadata applied to all pages
- **Page Templates**: Pre-configured metadata for specific pages
- **Utility Functions**: Helper functions for metadata generation
- **Structured Data**: Schema.org generators for rich snippets

### 2. Page Metadata Files

Each major route has its own `metadata.ts` file:

- `/app/(main)/metadata.ts` - Home page
- `/app/(main)/cursor/metadata.ts` - Cursor Ambassador page
- `/app/(main)/guestbook/metadata.ts` - Guestbook page
- `/app/(main)/surveys/metadata.ts` - Surveys page
- `/app/(main)/polls/metadata.ts` - Polls page

### 3. Dynamic Metadata

The guestbook ticket page (`/guestbook/[id]`) generates metadata dynamically based on the ticket data, including custom OG images.

## Usage

### Adding Metadata to a New Page

1. Create a `metadata.ts` file in your page directory:

```typescript
import type { Metadata } from 'next';
import { createMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Your Page Title | Walter Morales',
    description: 'Your page description',
    url: `${siteConfig.url}/your-page`,
  },
  alternates: {
    canonical: `${siteConfig.url}/your-page`,
  },
});
```

2. Export the metadata in your `page.tsx`:

```typescript
export { metadata } from './metadata';
```

### Updating Site-wide Metadata

Edit `/lib/metadata.ts` to update:

- Site configuration
- Default keywords
- Author information
- Social media links

### Dynamic Metadata Generation

For pages with dynamic content:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(params.id);

  return createMetadata({
    title: data.title,
    description: data.description,
    // ... other metadata
  });
}
```

## SEO Features

### 1. Open Graph Tags

- Optimized for social media sharing
- Custom images per page
- Proper fallbacks

### 2. Twitter Cards

- Summary large image cards
- Author attribution
- Custom images

### 3. Structured Data

- Person schema for author
- Website schema
- Breadcrumb support

### 4. Technical SEO

- Canonical URLs
- Robots meta tags
- Sitemap generation
- Web app manifest

## Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Meta Descriptions**: Keep under 160 characters, include keywords naturally
3. **Keywords**: Use relevant, specific keywords for each page
4. **OG Images**: Create custom images for major pages (1200x630px)
5. **Canonical URLs**: Always set canonical URLs to avoid duplicate content issues

## Monitoring

To verify your SEO implementation:

1. Use the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Use the [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. Check Google Search Console for indexing status
4. Use Lighthouse for SEO audits

## Environment Variables

Ensure these are set:

- `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., https://waltermorales.dev)

## Future Improvements

Consider adding:

- JSON-LD for article pages
- RSS feed generation
- More specific OG images per page
- Multi-language support
- Schema markup for events (polls/surveys)
