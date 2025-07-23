# Homepage (/) - README

## Overview
The homepage serves as the landing page for Walter Morales' personal portfolio website. It showcases his professional background as a Sr Software Engineer and Cursor Ambassador.

## Page Structure
- **Route**: `/` (app/(main)/page.tsx)
- **Layout**: Uses the main layout (app/(main)/layout.tsx)
- **Metadata**: Defined in app/(main)/metadata.ts

## Components

### Main Sections
1. **HeroSection** - Primary introduction and hero area
2. **ExperienceSection** - Professional experience showcase

### Technical Implementation
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark mode support
- **Type Safety**: Full TypeScript implementation
- **SEO**: Comprehensive metadata with Open Graph support

## Features
- Responsive design optimized for all devices
- Dark mode support (default theme)
- SEO-optimized with custom Open Graph image
- Accessibility-focused implementation
- Server-side rendering for optimal performance

## File Structure
```
app/(main)/
├── page.tsx           # Main homepage component
├── metadata.ts        # SEO and metadata configuration
└── layout.tsx         # Shared layout wrapper
```

## Related Components
- `@/components/landing/hero-section` - Hero area implementation
- `@/components/landing/experience-section` - Experience showcase
- `@/lib/metadata` - Base metadata configuration

## Navigation Anchors
- `#home` - Hero section anchor
- `#experience` - Experience section anchor

## Metadata Configuration
- Custom Open Graph image: `/og-home.png`
- Canonical URL: Site root
- Professional title: "Sr Software Engineer & Cursor Ambassador"
- Optimized for social sharing and search engines