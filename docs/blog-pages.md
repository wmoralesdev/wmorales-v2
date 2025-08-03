# Blog Pages (/blog) - README

## Overview

The blog section is a comprehensive content management system built with Keystatic CMS and Markdoc. It features advanced search, filtering, tagging, and content management capabilities.

## Page Structure

### Blog Index (/blog)

- **Route**: `/blog` (app/(main)/blog/page.tsx)
- **Purpose**: Main blog listing with search and filtering capabilities

### Individual Blog Posts (/blog/[slug])

- **Route**: `/blog/[slug]` (app/(main)/blog/[slug]/page.tsx)
- **Purpose**: Individual blog post display with enhanced reading experience

## Features

### Blog Index Features

- **Advanced Search**: Real-time search through post titles and content
- **Tag Filtering**: Filter posts by multiple tags
- **Sorting Options**: Sort by date (desc/asc) and other criteria
- **Featured Posts**: Special highlighting for featured content
- **Results Counter**: Shows filtered vs total post counts
- **Responsive Grid**: Adaptive layout for different screen sizes

### Blog Post Features

- **Reading Progress**: Visual progress indicator
- **Reading Time**: Automatic calculation of estimated reading time
- **Social Sharing**: Built-in share buttons for multiple platforms
- **Tag Navigation**: Clickable tags for related content discovery
- **Enhanced Typography**: Optimized prose styling with syntax highlighting
- **View Tracking**: Automatic view counting for analytics
- **SEO Optimization**: Full Open Graph and Twitter Card support

## Technical Implementation

### Content Management

- **CMS**: Keystatic for content editing and management
- **Markdown**: Enhanced Markdoc with custom components
- **Static Generation**: Pre-generated pages for optimal performance
- **Dynamic Routes**: Automatic route generation from content

### Search & Filtering

- **Server Actions**: `searchBlogPosts()` for efficient filtering
- **Search Parameters**: URL-based state management
- **Tag Management**: Dynamic tag extraction and filtering
- **Real-time Updates**: Instant search results without page reloads

### Code Highlighting

- **Syntax Highlighting**: Custom CodeBlock component with copy functionality
- **Multiple Languages**: Support for various programming languages
- **Theme Integration**: Dark mode optimized code blocks

## File Structure

```
app/(main)/blog/
├── page.tsx              # Blog index with search/filter
├── [slug]/
│   └── page.tsx           # Individual blog post
└── actions/
    └── blog.actions.ts    # Server actions for blog operations

components/blog/
├── searchbar.tsx          # Search and filter interface
└── markdown/
    ├── post-card.tsx      # Blog post preview cards
    ├── code-block.tsx     # Enhanced code display
    ├── reading-progress.tsx
    └── share-buttons.tsx

content/posts/             # Keystatic managed content
├── *.mdoc                # Blog post files
```

## Search Parameters

- `q` - Search query string
- `tags` - Tag filter (string or array)
- `sort` - Sorting option (default: 'date-desc')
- `featured` - Show only featured posts (boolean)

## Components Integration

### PostCard Component

- Displays post preview with title, description, and metadata
- Responsive design with hover effects
- Tag display and click navigation
- Featured post highlighting

### Searchbar Component

- Real-time search input
- Tag selection interface
- Sort option dropdown
- Results counter display
- Filter state management

### Enhanced Markdoc Components

- **CodeBlock**: Syntax highlighted code with copy button
- **Callout**: Styled notification blocks
- **Image**: Optimized image rendering with captions
- **Video**: Embedded video support
- **Link**: Enhanced link styling with external indicators

## SEO & Performance

- **Static Generation**: Pages pre-generated at build time
- **Dynamic Metadata**: Automatic meta tags from post content
- **Open Graph**: Rich social media previews
- **Reading Time**: Calculated from actual content length
- **View Tracking**: Analytics integration for content performance

## Content Workflow

1. **Creation**: Posts created via Keystatic CMS interface
2. **Editing**: Visual editor with live preview
3. **Publishing**: Automatic deployment pipeline
4. **Analytics**: View tracking and engagement metrics
