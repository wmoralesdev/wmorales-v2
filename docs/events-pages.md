# Events Pages (/events) - README

## Overview

The Events system is an innovative feature that allows real-time photo sharing during events through QR code scanning. It's designed for Cursor events and community gatherings, enabling attendees to contribute to a shared photo gallery.

## Page Structure

### Events Index (/events)

- **Route**: `/events` (app/(main)/events/page.tsx)
- **Purpose**: Main events hub with QR scanner and active events list

### Individual Event Gallery (/events/[id])

- **Route**: `/events/[id]` (app/(main)/events/[id]/page.tsx)
- **Purpose**: Event-specific photo gallery with upload functionality

## Features

### Events Index Features

- **Dual Interface**: Tabbed layout with Scanner and Events tabs
- **QR Code Scanner**: Camera-based QR code detection for event access
- **Active Events List**: Browse currently available events
- **Responsive Design**: Glassmorphism cards with purple accent theme
- **Loading States**: Suspense-based loading with animated indicators

### Event Gallery Features

- **Photo Grid**: Dynamic gallery layout for event images
- **Image Upload**: Real-time photo contribution by attendees
- **Image Management**: Upload, view, and organize event photos
- **Social Sharing**: Event-specific photo sharing capabilities
- **Real-time Updates**: Live gallery updates as photos are added

## Technical Implementation

### QR Code Integration

- **Camera Access**: Browser camera API for QR scanning
- **Event Linking**: QR codes contain event IDs for direct gallery access
- **Security**: Validated event access through QR verification
- **Cross-platform**: Works on mobile and desktop browsers

### Database Schema

Events are managed through Prisma with the following structure:

- **Event Model**: ID, title, description, timestamps
- **Image Model**: URL, caption, event relationship
- **Real-time Sync**: Database updates trigger UI refreshes

### File Upload System

- **Image Processing**: Automatic image optimization and resizing
- **Storage**: Cloud-based image storage with CDN delivery
- **Progress Tracking**: Upload progress indicators
- **Error Handling**: Comprehensive upload error management

## Components Architecture

### EventsScanner Component

- **QR Detection**: Real-time QR code scanning functionality
- **Camera Interface**: User-friendly camera controls
- **Event Navigation**: Automatic redirection to scanned events
- **Permission Handling**: Camera permission requests and fallbacks

### EventsList Component

- **Event Display**: Grid layout of active events
- **Event Cards**: Interactive event previews with metadata
- **Navigation**: Direct links to event galleries
- **Status Indicators**: Active vs inactive event states

### EventGallery Component

- **Image Grid**: Responsive masonry-style photo layout
- **Upload Interface**: Drag-and-drop and click-to-upload functionality
- **Image Preview**: Full-size image viewing with navigation
- **Caption System**: Optional image descriptions and metadata

## File Structure

```
app/(main)/events/
├── page.tsx              # Events index with scanner and list
├── [id]/
│   └── page.tsx          # Individual event gallery
└── actions/
    └── events.actions.ts # Server actions for event operations

components/events/
├── events-scanner.tsx    # QR code scanning component
├── events-list.tsx       # Active events listing
├── event-gallery.tsx    # Photo gallery with upload
├── image-grid.tsx        # Responsive image layout
└── image-upload.tsx      # File upload interface
```

## User Experience Flow

### QR Code Workflow

1. **Scan**: User opens events page and scans QR code
2. **Verify**: System validates QR code and event access
3. **Navigate**: Automatic redirection to event gallery
4. **Participate**: Upload photos and view gallery

### Direct Access Workflow

1. **Browse**: User views active events list
2. **Select**: Click on event to access gallery
3. **Engage**: View existing photos and upload new ones
4. **Share**: Social sharing of event experience

## Real-time Features

- **Live Updates**: Gallery refreshes as new photos are uploaded
- **Collaborative**: Multiple users can contribute simultaneously
- **Instant Feedback**: Immediate upload confirmation and display
- **Cross-device Sync**: Photos appear across all connected devices

## Security & Privacy

- **Event Validation**: Only valid events accept photo uploads
- **Content Moderation**: Uploaded content review system
- **Privacy Controls**: Optional photo attribution and privacy settings
- **Data Protection**: Secure image storage with access controls

## Mobile Optimization

- **Touch Interface**: Mobile-optimized touch interactions
- **Camera Integration**: Native mobile camera access
- **Responsive Grid**: Adaptive photo layouts for mobile screens
- **Offline Support**: Progressive web app capabilities for offline viewing

## Performance Considerations

- **Image Optimization**: Automatic compression and format conversion
- **Lazy Loading**: Images load as they enter viewport
- **CDN Delivery**: Fast global image delivery
- **Caching Strategy**: Intelligent cache management for galleries

## Analytics & Insights

- **Event Metrics**: Photo count, participant tracking
- **Engagement Data**: View counts and interaction statistics
- **Performance Monitoring**: Upload success rates and load times
- **User Behavior**: Gallery interaction patterns and preferences

## Future Enhancements

- **Video Support**: Video upload and playback capabilities
- **Live Streaming**: Real-time event streaming integration
- **AI Features**: Automatic photo tagging and organization
- **Social Integration**: Direct sharing to social media platforms
