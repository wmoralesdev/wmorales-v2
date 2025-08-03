# Guestbook Pages (/guestbook) - README

## Overview

The Digital Guestbook is an innovative feature that creates conference-style tickets with AI-generated colors based on user mood. It combines real-time collaboration, authentication, and creative AI to provide a unique visitor experience.

## Page Structure

### Guestbook Index (/guestbook)

- **Route**: `/guestbook` (app/(main)/guestbook/page.tsx)
- **Purpose**: Main guestbook interface for creating and viewing tickets

### Individual Ticket View (/guestbook/[id])

- **Route**: `/guestbook/[id]` (app/(main)/guestbook/[id]/page.tsx)
- **Purpose**: Shareable individual ticket display with social features

## Features

### Guestbook Index Features

- **AI-Powered Ticket Generation**: Mood-based color scheme creation
- **Real-time Collaboration**: Live updates as new entries are added
- **Authentication Integration**: Supabase auth with Google/GitHub providers
- **Ticket Carousel**: Interactive display of recent visitor tickets
- **Social Sharing**: Built-in sharing capabilities for individual tickets
- **Responsive Design**: Mobile-optimized ticket creation and viewing

### Individual Ticket Features

- **Dynamic OG Images**: Auto-generated Open Graph images for social sharing
- **Unique Ticket Display**: Conference-style ticket design with AI colors
- **Mood Attribution**: Display of user's mood that influenced the design
- **Call-to-Action**: Encouragement for visitors to create their own tickets
- **SEO Optimization**: Individual page SEO for better discoverability

## Technical Implementation

### AI Color Generation

- **Mood Analysis**: User input processed for color scheme generation
- **Color Psychology**: AI applies color theory based on emotional states
- **Unique Palettes**: Each ticket receives a distinct 4-color scheme:
  - Primary Color (main ticket element)
  - Secondary Color (supporting elements)
  - Accent Color (highlights and details)
  - Background Color (ticket background)

### Real-time Features

- **Supabase Realtime**: Live database subscriptions for instant updates
- **Optimistic Updates**: Immediate UI feedback before database confirmation
- **Cross-user Sync**: Tickets appear across all connected sessions
- **Collision Handling**: Multiple simultaneous submissions management

### Authentication System

- **Supabase Auth**: OAuth integration with Google and GitHub
- **User Profiles**: Automatic profile creation with avatar and metadata
- **Session Management**: Persistent authentication across visits
- **Provider Flexibility**: Support for multiple OAuth providers

## Components Architecture

### GuestbookContent Component

- **Main Interface**: Primary guestbook creation and viewing interface
- **State Management**: Handles authentication, form state, and real-time updates
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Skeleton loading and suspense boundaries

### UserTicket Component

- **Ticket Design**: Conference-style ticket rendering with AI colors
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Animation**: Smooth transitions and hover effects
- **Accessibility**: Screen reader compatible with proper ARIA labels

### GuestbookTicketsCarousel Component

- **Recent Tickets**: Horizontal scrolling carousel of latest entries
- **Interactive Navigation**: Touch/mouse controls for ticket browsing
- **Lazy Loading**: Performance optimization for large ticket sets
- **Auto-refresh**: Periodic updates with new ticket additions

## File Structure

```
app/(main)/guestbook/
├── page.tsx                    # Main guestbook interface
├── metadata.ts                 # SEO configuration
├── [id]/
│   └── page.tsx               # Individual ticket display
└── actions/
    └── guestbook.actions.ts   # Server actions for guestbook operations

components/guestbook/
├── guestbook-content.tsx       # Main guestbook component
├── guestbook-loading.tsx       # Loading states
├── guestbook-tickets-carousel.tsx # Recent tickets display
├── guestbook-user-ticket.tsx   # Individual ticket component
├── sign-in-card.tsx           # Authentication interface
└── user-ticket.tsx            # Ticket rendering component
```

## Database Schema

The guestbook uses Prisma with the following key models:

- **GuestbookEntry**: Core entry data with mood and user info
- **GuestbookTicket**: Ticket-specific data with AI-generated colors
- **User Integration**: Links to Supabase auth for user management

## Real-time Architecture

- **Supabase Realtime**: WebSocket connections for live updates
- **Channel Subscriptions**: Dedicated channels for guestbook events
- **Event Types**: INSERT, UPDATE, DELETE operations synchronized
- **Conflict Resolution**: Last-writer-wins with optimistic updates

## AI Integration

### Color Generation Process

1. **Mood Analysis**: User input processed for emotional context
2. **Color Mapping**: AI maps emotions to color psychology principles
3. **Palette Creation**: Generate harmonious 4-color schemes
4. **Validation**: Ensure accessibility and visual appeal
5. **Application**: Colors applied to ticket components

### Mood Processing

- **Natural Language**: Accept free-form mood descriptions
- **Emotion Recognition**: Extract emotional context from text
- **Color Translation**: Convert emotions to visual representations
- **Personalization**: Adapt to individual expression styles

## Social Features

### Ticket Sharing

- **Individual URLs**: Each ticket gets a unique shareable URL
- **Dynamic OG Images**: Auto-generated social media previews
- **Social Meta Tags**: Optimized for Twitter, Facebook, LinkedIn
- **Viral Mechanics**: Encourage sharing through visual appeal

### Community Interaction

- **Recent Tickets**: Public display of latest community contributions
- **Discovery**: Browse and explore other user tickets
- **Inspiration**: Mood examples to inspire new visitors
- **Engagement**: Visual feedback and interaction encouragement

## Performance Optimizations

- **Image Optimization**: AI-generated OG images cached efficiently
- **Real-time Efficiency**: Selective subscription to minimize bandwidth
- **Component Lazy Loading**: Dynamic imports for non-critical components
- **Database Indexing**: Optimized queries for ticket retrieval

## Security & Privacy

- **Authentication Required**: Only authenticated users can create tickets
- **Data Validation**: Server-side validation of all user inputs
- **Rate Limiting**: Prevent spam and abuse of AI generation
- **Content Moderation**: Review system for inappropriate content

## Analytics & Insights

- **Creation Metrics**: Track ticket generation patterns
- **Mood Trends**: Analyze community mood patterns over time
- **Sharing Analytics**: Monitor social sharing performance
- **User Engagement**: Track return visits and interaction patterns
