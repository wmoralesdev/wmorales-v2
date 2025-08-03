# Cursor Ambassador Page (/cursor) - README

## Overview

The Cursor Ambassador page showcases Walter Morales' role as the first Cursor Ambassador from El Salvador, highlighting his expertise in AI-powered development and his mission to build the LATAM developer community.

## Page Structure

- **Route**: `/cursor` (app/(main)/cursor/page.tsx)
- **Layout**: Uses the main layout with specialized metadata
- **Component**: Custom CursorPageContent with advanced animations

## Features

### Visual Design

- **Glassmorphism Effects**: Backdrop blur and translucent elements
- **Gradient Overlays**: Purple-themed gradients throughout
- **Advanced Animations**: Framer Motion with staggered reveals
- **Interactive Cards**: Hover effects with scale and gradient transitions
- **Floating Elements**: Subtle animation for visual appeal

### Content Sections

#### 1. Hero Section

- **Pioneer Badge**: Animated floating badge highlighting El Salvador origin
- **Gradient Typography**: Large title with purple gradient text effect
- **Call-to-Action**: LinkedIn and GitHub profile links
- **Background**: Grid pattern with gradient overlay

#### 2. Philosophy Section

- **Core Message**: "Coexist with AI, Don't Depend on It"
- **Development Approach**: Focus on AI as a tool, not replacement
- **Glassmorphism Card**: Elevated design with blur effects

#### 3. Core Expertise

Three specialized areas:

- **Tab Completion Mastery**: Advanced autocomplete techniques
- **Inline Edit Workflows**: Efficient code transformation methods
- **Agentic Prompts**: Strategic AI prompt engineering

#### 4. Vision & Community

- **LATAM Community Building**: Regional developer community initiatives
- **Future Focus**: AI-powered development evolution
- **Local Impact**: Spanish-language resources and support

#### 5. Services Offered

- **Team Training**: Comprehensive Cursor workshops
- **Consultations**: One-on-one development acceleration
- **Community Access**: WhatsApp group and resource sharing

#### 6. Call-to-Action

- **Calendly Integration**: Direct consultation scheduling
- **Community Contact**: Email for community joining
- **Resource Preview**: Upcoming blog content teaser

## Technical Implementation

### Animation System

- **Framer Motion**: Comprehensive animation library integration
- **Variants**: Reusable animation configurations
- **Stagger Effects**: Sequential element reveals
- **Viewport Triggers**: Scroll-based animation activation
- **Hover States**: Interactive card transformations

### Component Architecture

- **Client Component**: Uses 'use client' directive for interactivity
- **Icon Library**: Lucide React for consistent iconography
- **Responsive Design**: Mobile-first with breakpoint optimizations
- **Performance**: Optimized animations with hardware acceleration

### Styling Approach

- **Tailwind CSS**: Utility-first styling with custom gradients
- **Dark Theme**: Exclusively dark mode design
- **Glass Effects**: backdrop-blur and transparency combinations
- **Gradient Backgrounds**: Multi-layer gradient systems
- **Border Animations**: Dynamic border color transitions

## File Structure

```
app/(main)/cursor/
├── page.tsx                    # Route handler
├── metadata.ts                 # SEO configuration
components/cursor/
└── cursor-page-content.tsx     # Main page component
```

## SEO & Metadata

- **Custom OG Image**: `/og-cursor.png` for social sharing
- **Structured Metadata**: Comprehensive Open Graph and Twitter Cards
- **Canonical URL**: Proper SEO URL structure
- **Keywords**: AI development, Cursor, LATAM, ambassador-focused

## Interactive Elements

- **Floating Animations**: Continuous Y-axis movement
- **Card Hover Effects**: Scale transformations and gradient reveals
- **Button Interactions**: Gradient shifts and shadow effects
- **Scroll Animations**: Viewport-based animation triggers

## External Integrations

- **LinkedIn**: Professional profile linking
- **GitHub**: Code template repository access
- **Calendly**: Direct consultation booking
- **Email**: Community contact integration

## Responsive Behavior

- **Mobile Optimization**: Touch-friendly interactions
- **Tablet Layout**: Adjusted grid systems
- **Desktop Enhancement**: Full animation suite
- **Cross-browser**: Consistent experience across platforms

## Performance Considerations

- **Animation Optimization**: Hardware-accelerated transforms
- **Lazy Loading**: Viewport-based component rendering
- **Image Optimization**: Next.js automatic optimization
- **Bundle Splitting**: Component-level code splitting
