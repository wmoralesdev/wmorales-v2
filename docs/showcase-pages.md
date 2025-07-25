# Showcase Pages Documentation

## Overview

The showcase section displays your portfolio of projects with filtering, searching, and sorting capabilities.

## Structure

```
app/(main)/showcase/
├── page.tsx          # Main showcase page
├── metadata.ts       # SEO metadata
└── [id]/            # (Future) Individual project pages
    └── page.tsx

components/showcase/
├── showcase-content.tsx    # Main content wrapper with state management
├── project-grid.tsx       # Grid layout for project cards
├── project-card.tsx       # Individual project card component
└── project-filters.tsx    # Filters and search functionality

lib/
├── types/showcase.types.ts    # TypeScript types and interfaces
└── data/projects.ts          # Projects data source
```

## Adding New Projects

To add a new project, edit the `lib/data/projects.ts` file:

```typescript
{
  id: 'unique-project-id',
  title: 'Your Project Name',
  description: 'Brief description (shown in card)',
  longDescription: 'Detailed description for project page',
  tags: ['react', 'nodejs', 'typescript'],
  category: ProjectCategory.WEB_APP,
  images: {
    thumbnail: '/projects/your-project/thumbnail.png',
    gallery: [
      '/projects/your-project/screenshot1.png',
      '/projects/your-project/screenshot2.png',
    ],
  },
  links: {
    github: 'https://github.com/yourusername/project',
    live: 'https://your-project.com',
    demo: 'https://demo.your-project.com',
    documentation: 'https://docs.your-project.com',
  },
  technologies: [
    { name: 'React', category: TechCategory.FRONTEND },
    { name: 'Node.js', category: TechCategory.BACKEND },
    // Add more technologies...
  ],
  status: ProjectStatus.COMPLETED,
  featured: true, // Show in featured section
  year: 2024,
  duration: '3 months',
  role: 'Full Stack Developer',
  team: [
    {
      name: 'John Doe',
      role: 'UI/UX Designer',
      avatar: '/team/john.jpg',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
  ],
  achievements: [
    'Key achievement 1',
    'Key achievement 2',
    'Key achievement 3',
  ],
}
```

## Project Categories

- `WEB_APP`: Web applications
- `MOBILE_APP`: Mobile applications
- `API`: APIs and backend services
- `LIBRARY`: Libraries and packages
- `TOOL`: Developer tools and CLIs
- `GAME`: Games
- `AI_ML`: AI/ML projects
- `BLOCKCHAIN`: Blockchain projects
- `OTHER`: Other projects

## Project Status

- `IN_PROGRESS`: Currently being developed
- `COMPLETED`: Finished projects
- `MAINTAINED`: Actively maintained
- `ARCHIVED`: No longer maintained

## Technology Categories

- `FRONTEND`: Frontend technologies
- `BACKEND`: Backend technologies
- `DATABASE`: Databases
- `DEVOPS`: DevOps tools
- `CLOUD`: Cloud services
- `MOBILE`: Mobile development
- `AI_ML`: AI/ML technologies
- `BLOCKCHAIN`: Blockchain technologies
- `OTHER`: Other technologies

## Features

### Filtering
- Filter by category
- Filter by status
- Filter by featured projects
- Filter by technologies (future)
- Filter by year (future)

### Sorting
- Newest first (default)
- Oldest first
- Alphabetical by title
- By category

### Search
- Search by project title
- Search by description
- Search by tags

## Image Guidelines

1. **Thumbnail**: 16:9 aspect ratio, recommended 800x450px
2. **Gallery Images**: High quality screenshots, recommended 1920x1080px
3. **Team Avatars**: Square images, recommended 200x200px

Store images in: `public/projects/[project-name]/`

## Future Enhancements

1. **Individual Project Pages**: Detailed pages for each project with:
   - Full description
   - Image gallery
   - Technical deep dive
   - Team information
   - Related projects

2. **Advanced Filters**:
   - Filter by technologies
   - Filter by year range
   - Multi-select filters

3. **Analytics**:
   - View count
   - Like/favorite system
   - Share functionality

4. **Integration**:
   - GitHub API integration for stats
   - Live demo embeds
   - Video demonstrations