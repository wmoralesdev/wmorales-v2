# Markdoc Implementation Guide

## Overview

This guide explains the Markdoc implementation that provides a powerful, secure, and developer-friendly content creation system. Our setup combines Keystatic for GitHub-based content management with rich Markdoc components for interactive content.

## Why This Approach?

### ✅ Benefits of Enhanced Markdoc + Keystatic:

1. **Security**: Markdoc's safe content model prevents arbitrary code execution
2. **GitHub Integration**: Content managed directly in your repository
3. **Type Safety**: Full TypeScript support with validation
4. **Performance**: Optimized rendering and caching
5. **Developer Experience**: Rich components with great UX
6. **Flexibility**: Extensible architecture

### ❌ Why Not @next/mdx?

1. **Security Risk**: MDX can execute arbitrary JavaScript
2. **No CMS Integration**: Doesn't work with Keystatic's workflow
3. **Build Complexity**: Requires complex configuration for GitHub content
4. **Content Validation**: Less robust error handling

## Enhanced Components

### 1. Enhanced Callouts

Rich callouts with multiple types and better styling:

```markdoc
{% callout type="info" title="Optional Title" %}
Your callout content here
{% /callout %}
```

**Types**: `info`, `warning`, `error`, `success`, `tip`

### 2. Enhanced Code Blocks

Interactive code blocks with copy functionality:

```markdoc
{% code-block language="typescript" filename="api/users.ts" %}
export async function GET() {
  return Response.json({ users: [] });
}
{% /code-block %}
```

**Features**:

- Copy button on hover
- Syntax highlighting
- Optional filename display
- Line numbers support
- Multiple language support

### 3. Enhanced Cards

Cards with titles, descriptions, and variants:

```markdoc
{% card title="Card Title" description="Card description" variant="feature" %}
Card content goes here
{% /card %}
```

**Variants**: `default`, `feature`, `warning`, `success`

### 4. Video Embeds

Native video support with poster images:

```markdoc
{% video src="/videos/demo.mp4" title="Demo Video" poster="/images/poster.jpg" %}
```

### 5. Enhanced Images

Images with captions and optimization:

```markdoc
![Alt text](/images/example.jpg "Caption text")
```

**Features**:

- Automatic optimization with Next.js Image
- Caption support
- Priority loading option
- Responsive design

### 6. Enhanced Links

Links with external indicators and better UX:

```markdoc
[External Link](https://example.com)
[Internal Link](/internal-page)
```

**Features**:

- Automatic external link detection
- External link icons
- Security attributes for external links
- Smooth scrolling for anchor links

### 7. Separators

Customizable separators for content sections:

```markdoc
{% separator spacing="large" %}
```

**Spacing Options**: `small`, `normal`, `large`

### 8. Typography Enhancements

All headings support anchor links:

```markdoc
## Your Heading
```

**Features**:

- Automatic anchor link generation
- Hover-to-reveal link icons
- Smooth scrolling to sections
- Accessible navigation

## Implementation Details

### Component Architecture

```typescript
// components/markdown/index.tsx
export const MarkdownComponents = {
  // Enhanced components
  Image: EnhancedImage,
  Link: EnhancedLink,
  Card: EnhancedCard,
  CodeBlock: EnhancedCodeBlock,
  Callout: EnhancedCallout,
  Video,
  Separator: EnhancedSeparator,
  TableOfContents,

  // Typography with anchor links
  h1,
  h2,
  h3,

  // Utility components
  CopyButton,
  Badge,
  Button,
  Alert,
};
```

### Markdoc Configuration

```typescript
// lib/blog/markdoc.ts
const config = {
  tags: {
    callout: {
      /* callout configuration */
    },
    card: {
      /* card configuration */
    },
    "code-block": {
      /* code block configuration */
    },
    video: {
      /* video configuration */
    },
    separator: {
      /* separator configuration */
    },
  },
  nodes: {
    image: {
      /* enhanced image node */
    },
    link: {
      /* enhanced link node */
    },
    heading: {
      /* enhanced heading node */
    },
  },
};
```

## Content Creation Workflow

### 1. Using Keystatic Admin

1. Navigate to `/keystatic` in your development environment
2. Create or edit blog posts using the visual editor
3. Preview changes in real-time
4. Publish to create a pull request

### 2. Direct File Editing

1. Edit `.mdoc` files in `content/posts/`
2. Use the enhanced Markdoc syntax for rich components
3. Commit changes to trigger regeneration

### 3. GitHub Integration

1. Content is stored in your repository
2. Changes create pull requests for review
3. Merge to publish content
4. Full version control for all content

## Best Practices

### 1. Security

- ✅ Use Markdoc tags instead of raw HTML
- ✅ Validate all user inputs
- ✅ Use provided components for consistency
- ❌ Avoid inline JavaScript or HTML

### 2. Performance

- ✅ Use `priority` prop for above-the-fold images
- ✅ Optimize images before uploading
- ✅ Use appropriate video formats
- ✅ Minimize large content blocks

### 3. Accessibility

- ✅ Always provide alt text for images
- ✅ Use semantic heading structure
- ✅ Include captions for videos
- ✅ Use descriptive link text

### 4. SEO

- ✅ Use proper heading hierarchy
- ✅ Include meta descriptions
- ✅ Optimize images with alt text
- ✅ Use internal linking

## Migration Guide

### From Basic Markdoc

1. Update component imports
2. Replace basic tags with enhanced versions
3. Add new features gradually
4. Test thoroughly

### From MDX

1. Convert MDX files to Markdoc format
2. Replace JSX components with Markdoc tags
3. Update import statements
4. Validate content safety

## Troubleshooting

### Common Issues

1. **Component Not Rendering**

   - Check tag syntax and attributes
   - Verify component is exported in MarkdownComponents
   - Check for typos in tag names

2. **Copy Button Not Working**

   - Ensure client-side rendering is enabled
   - Check browser clipboard permissions
   - Verify JavaScript is enabled

3. **Images Not Loading**
   - Check file paths and existence
   - Verify Next.js Image configuration
   - Check image optimization settings

### Debug Mode

Enable debug logging:

```typescript
// lib/blog/markdoc.ts
export function parseMarkdoc(content: string) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast, config);

  if (errors.length) {
    console.error("Markdoc validation errors:", errors);
    // Handle errors appropriately
  }
}
```

## Extending the System

### Adding New Components

1. Create the React component
2. Add it to MarkdownComponents
3. Define the Markdoc tag configuration
4. Add TypeScript types
5. Update documentation

### Custom Attributes

```typescript
const customTag = {
  render: "CustomComponent",
  attributes: {
    customProp: {
      type: String,
      required: true,
      description: "Custom property description",
    },
  },
};
```

## Performance Optimization

### Bundle Size

- Components are tree-shaken automatically
- Only used components are included in bundles
- Minimal JavaScript footprint

### Rendering Performance

- Server-side rendering for initial load
- Client-side hydration for interactivity
- Optimized re-renders with React

### Caching

- Static generation for blog posts
- CDN caching for assets
- Browser caching for components

## Conclusion

This enhanced Markdoc implementation provides a powerful, secure, and maintainable content creation system. It combines the best of both worlds: the security and performance of Markdoc with the rich functionality that content creators need.

The GitHub-based workflow with Keystatic ensures that your content is version-controlled, reviewable, and easily manageable, while the enhanced components provide the rich features that make content engaging and interactive.

## Resources

- [Markdoc Documentation](https://markdoc.dev)
- [Keystatic Documentation](https://keystatic.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Component Source Code](../components/markdown/)

## Support

If you encounter issues or have questions:

1. Check the troubleshooting section
2. Review component documentation
3. Check GitHub issues
4. Create a new issue with details
 