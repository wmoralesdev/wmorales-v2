# Events System Documentation

## Overview

The Events System is a comprehensive solution for managing Cursor events with QR code scanning, real-time photo galleries, and image uploads. It allows users to scan QR codes to access event galleries and upload 10-15 photos per event.

## Features

### 🎯 Core Features

- **QR Code Scanning**: Scan QR codes to access event galleries
- **Real-time Gallery**: Live updates when users upload photos
- **Image Upload**: Upload up to 15 photos per event with captions
- **Supabase Storage**: Secure image storage with automatic cleanup
- **User Management**: Track user uploads and prevent abuse
- **Event Management**: Create and manage events with expiration dates

### 📱 User Experience

- **Mobile-First Design**: Optimized for mobile QR code scanning
- **Real-time Updates**: See new photos as they're uploaded
- **Image Preview**: Click images to view full-size with captions
- **Upload Progress**: Visual feedback during image uploads
- **Error Handling**: Clear error messages and validation

### 🔧 Technical Features

- **Next.js 15**: Latest app router with server components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive design system
- **shadcn/ui**: Consistent UI components
- **Supabase**: Authentication, storage, and real-time features
- **Prisma**: Type-safe database operations

## Database Schema

### Event Model

```prisma
model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  qrCode      String   @unique @default(cuid())
  isActive    Boolean  @default(true)
  maxImages   Int      @default(15)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  endsAt      DateTime?

  images EventImage[]
}
```

### EventImage Model

```prisma
model EventImage {
  id        String   @id @default(uuid())
  eventId   String
  profileId String
  imageUrl  String
  caption   String?
  createdAt DateTime @default(now())

  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

## Setup Instructions

### 1. Database Migration

```bash
# Generate and apply migrations
pnpm prisma:migrate

# Seed with sample events
pnpm prisma:seed:events
```

### 2. Supabase Storage Setup

Create a storage bucket named `event-images` in your Supabase project with the following policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'event-images');

-- Allow public read access to images
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Allow users to delete their own images
CREATE POLICY "Allow user deletes" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated'
  AND bucket_id = 'event-images'
  AND auth.uid()::text = (storage.foldername(name))[2]
);
```

### 3. Environment Variables

Ensure these environment variables are set:

```env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Creating Events

Events can be created through the admin interface or directly in the database. Each event gets a unique QR code that users can scan.

### QR Code Generation

QR codes should contain the event's `qrCode` field value. Users scan these codes to access the event gallery.

### Image Upload Process

1. User scans QR code or navigates to event
2. Selects image file (max 10MB)
3. Optionally adds caption
4. Image is uploaded to Supabase storage
5. Database record is created
6. Real-time update is broadcast to all viewers

### Real-time Features

- **Live Updates**: New photos appear instantly for all viewers
- **Active Viewers**: Shows how many people are currently viewing the gallery
- **Presence Tracking**: Tracks who is currently viewing the event

## API Endpoints

### Server Actions

- `createEvent(data)`: Create a new event
- `getEventByQRCode(qrCode)`: Get event by QR code
- `getEventById(id)`: Get event by ID
- `uploadEventImage(data)`: Upload image to event
- `getUserEventImages(eventId)`: Get user's images for event
- `deleteEventImage(imageId)`: Delete user's image
- `getActiveEvents()`: Get all active events
- `generateUploadURL(eventId, fileName)`: Generate upload URL

### Real-time Channels

- `event:{eventId}`: Real-time updates for specific events
- Events: `image_uploaded`, `image_deleted`

## Components

### EventsScanner

QR code scanner component using HTML5 QR code library.

### EventsList

Displays active events with statistics and navigation.

### EventGallery

Main gallery component with upload functionality and real-time updates.

### ImageUpload

Handles file selection, preview, and upload to Supabase storage.

### ImageGrid

Responsive grid layout for displaying event photos.

## Security Features

### Authentication

- All uploads require user authentication
- Users can only delete their own images
- Event access is controlled through QR codes

### File Validation

- File type validation (images only)
- File size limits (10MB max)
- Secure upload URLs with expiration

### Rate Limiting

- Maximum images per user per event
- Upload frequency limits
- Event expiration dates

## Performance Optimizations

### Image Optimization

- Automatic image compression
- Responsive image sizes
- Lazy loading for gallery images

### Real-time Efficiency

- Efficient Supabase channel usage
- Minimal data transfer
- Connection pooling

### Database Optimization

- Indexed queries for fast lookups
- Efficient pagination
- Optimized joins

## Troubleshooting

### Common Issues

1. **QR Code Not Working**
   - Ensure QR code contains valid event code
   - Check if event is active and not expired
   - Verify camera permissions

2. **Upload Failures**
   - Check file size (max 10MB)
   - Verify file type (images only)
   - Ensure user is authenticated
   - Check Supabase storage permissions

3. **Real-time Not Working**
   - Verify Supabase real-time is enabled
   - Check network connectivity
   - Ensure proper channel subscription

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG=true
```

## Future Enhancements

### Planned Features

- **Admin Dashboard**: Manage events and users
- **Analytics**: Track event engagement
- **Social Features**: Like and comment on photos
- **Export**: Download event galleries
- **Advanced QR**: Custom QR code designs

### Technical Improvements

- **Image Processing**: Automatic cropping and filters
- **CDN Integration**: Faster image delivery
- **Offline Support**: Cache for offline viewing
- **Push Notifications**: New photo alerts

## Contributing

When contributing to the events system:

1. Follow the existing code patterns
2. Add TypeScript types for all new features
3. Include error handling and validation
4. Test real-time functionality
5. Update documentation for new features

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review Supabase documentation
3. Check the GitHub issues
4. Contact the development team
