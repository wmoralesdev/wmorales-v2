# Keystatic CMS (/keystatic) - README

## Overview

Keystatic CMS is the content management system that powers the blog functionality. It provides a modern, Git-based CMS solution with visual editing capabilities, Markdoc integration, and flexible deployment options for both local development and production environments.

## Page Structure

- **Route**: `/keystatic/[[...params]]` (app/keystatic/[[...params]]/page.tsx)
- **Layout**: Custom Keystatic layout (app/keystatic/layout.tsx)
- **Component**: Keystatic UI integration (app/keystatic/keystatic.tsx)

## Features

### Content Management

- **Visual Editor**: Rich text editing with live preview capabilities
- **Markdoc Integration**: Advanced markdown with custom components support
- **Image Management**: Drag-and-drop image uploads with automatic optimization
- **Git-based Storage**: Version control for all content changes
- **Dual Environment**: Local storage for development, GitHub for production

### Blog Post Management

- **WYSIWYG Editing**: Visual content creation with immediate preview
- **SEO Optimization**: Built-in meta description and title management
- **Tag System**: Multi-select tagging with predefined categories
- **Publication Control**: Featured posts and publication date management
- **Cover Images**: Required cover images with automatic path management

## Technical Implementation

### Storage Strategy

- **Development**: Local filesystem storage for rapid iteration
- **Production**: GitHub repository integration for deployment pipeline
- **Version Control**: Git-based content versioning and history
- **Deployment**: Automatic deployment triggers on content changes

### Content Schema

Comprehensive blog post schema including:

- **Title & Slug**: SEO-friendly URL generation
- **Description**: Meta description with character validation (50-160 chars)
- **Publication Date**: Automatic date handling with manual override
- **Featured Flag**: Boolean for featured post highlighting
- **Tags**: Predefined category system for content organization
- **Cover Image**: Required images with automatic path resolution
- **Content**: Rich Markdoc content with component support

## Configuration

### Keystatic Config (keystatic.config.ts)

```typescript
- Environment-based storage switching
- Collection definition for blog posts
- Field validation and requirements
- Image handling and optimization
- Markdoc configuration for rich content
```

### Supported Tags

- **AI/ML**: Artificial Intelligence and Machine Learning content
- **Web Development**: Frontend and backend development topics
- **DevOps**: Infrastructure and deployment practices
- **Career**: Professional development and career advice
- **Tutorial**: Step-by-step educational content
- **Cursor**: Cursor IDE and AI-powered development
- **Markdoc**: Documentation and content creation

## File Structure

```
app/keystatic/
├── [[...params]]/
│   └── page.tsx           # Keystatic router page
├── layout.tsx             # Keystatic app layout
└── keystatic.tsx          # Main Keystatic component

keystatic.config.ts        # CMS configuration
content/posts/              # Blog content storage
├── *.mdoc                 # Markdoc blog posts
public/blog/images/         # Blog image assets
```

## Content Workflow

### Development Workflow

1. **Local Editing**: Use local storage for content creation and testing
2. **Live Preview**: Real-time preview of content changes
3. **Version Control**: Git tracking of all content modifications
4. **Testing**: Validate content before production deployment

### Production Workflow

1. **GitHub Integration**: Content stored in separate GitHub repository
2. **Automated Deployment**: Content changes trigger site rebuilds
3. **Version Control**: Full content history and rollback capabilities
4. **Collaboration**: Multi-author support through GitHub permissions

## Image Management

### Upload System

- **Directory**: `/public/blog/images/` for all blog assets
- **Public Path**: `/blog/images/` for web serving
- **Validation**: Required cover images for all posts
- **Optimization**: Automatic image optimization and format conversion

### Asset Organization

- **Structured Storage**: Organized image storage by content type
- **Path Resolution**: Automatic path handling for development and production
- **CDN Integration**: Optimized delivery through Next.js image optimization
- **Backup Strategy**: Git-based asset versioning and recovery

## Markdoc Integration

### Enhanced Markdoc

- **Custom Components**: Extended component library for rich content
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Interactive Elements**: Custom callouts, cards, and interactive components
- **SEO Optimization**: Automatic meta tag generation from content

### Component Library

- **Code Blocks**: Syntax-highlighted code with copy functionality
- **Callouts**: Styled notification and warning blocks
- **Images**: Optimized image rendering with captions
- **Videos**: Embedded video support with responsive design
- **Links**: Enhanced link styling with external indicators

## SEO & Metadata

### Automatic SEO

- **Meta Descriptions**: Validated descriptions with character limits
- **Open Graph**: Automatic OG tag generation from post metadata
- **Twitter Cards**: Social media optimization for content sharing
- **Structured Data**: Rich snippets for search engine optimization

### Content Validation

- **Title Requirements**: SEO-friendly title generation and validation
- **Description Limits**: Character count validation (50-160 characters)
- **Image Requirements**: Mandatory cover images for visual appeal
- **Tag Validation**: Controlled vocabulary for consistent categorization

## Performance Optimizations

### Build-time Generation

- **Static Generation**: Content pre-generated at build time
- **Incremental Regeneration**: Selective content updates for performance
- **Image Optimization**: Automatic image compression and format conversion
- **Caching Strategy**: Strategic caching for content and assets

### Development Performance

- **Hot Reloading**: Immediate content updates during development
- **Lazy Loading**: Efficient loading of editor components
- **Local Caching**: Fast local content access and editing
- **Preview Mode**: Instant preview without full page reload

## Security Features

### Access Control

- **Authentication**: Secure access to content management interface
- **GitHub Integration**: Repository-based permission management
- **Content Validation**: Server-side validation of all content changes
- **Audit Trail**: Complete history of content modifications

### Data Protection

- **Version Control**: Git-based backup and recovery
- **Branch Protection**: Production content protection through branching
- **Rollback Capability**: Easy content rollback to previous versions
- **Backup Strategy**: Automated backup through Git history

## Deployment Integration

### CI/CD Pipeline

- **Automated Builds**: Content changes trigger automatic deployments
- **Preview Deployments**: Branch-based preview environments
- **Production Deployment**: Seamless production content updates
- **Rollback Support**: Quick rollback to previous content versions

### Environment Management

- **Development**: Local content editing and testing
- **Staging**: Preview environment for content validation
- **Production**: Live content serving with GitHub integration
- **Disaster Recovery**: Git-based content recovery and restoration
