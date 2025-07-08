# Guestbook Realtime Setup Guide

This guide explains how to set up and configure the realtime features for the Guestbook system.

## Overview

The Guestbook realtime feature allows users to see new tickets being created by other users in real-time. It uses Supabase Realtime channels for broadcasting ticket updates.

## Features

- **Real-time ticket updates**: See new tickets as they're created
- **Live viewer count**: Shows how many people are viewing the guestbook
- **Carousel display**: Tickets are displayed in an interactive carousel
- **Automatic updates**: New tickets automatically appear without page refresh

## Architecture

### Components

1. **`GuestbookTicketsCarousel`**: Main carousel component that displays tickets
2. **`useGuestbookRealtime`**: Hook that manages realtime subscriptions
3. **Realtime broadcasts**: Server-side broadcasts when tickets are created/updated

### Data Flow

1. User creates/updates a ticket → Server action
2. Server broadcasts the update via Supabase Realtime
3. All connected clients receive the update
4. Carousel automatically updates with new ticket

## Configuration

### Supabase Setup

The realtime features use Supabase's broadcast capabilities. No additional database configuration is needed beyond the existing Supabase setup.

### Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

### Basic Implementation

```tsx
import { GuestbookTicketsCarousel } from '@/components/guestbook-tickets-carousel';

// In your component
<GuestbookTicketsCarousel 
  initialTickets={tickets} 
  maxTickets={25} 
/>
```

### Customization

You can customize the carousel behavior:

- `maxTickets`: Maximum number of tickets to display (default: 25)
- `initialTickets`: Initial tickets to display before realtime updates

## Performance Considerations

1. **Ticket Limit**: The carousel displays up to 25 most recent tickets to maintain performance
2. **Debouncing**: Rapid ticket creation is automatically handled
3. **Connection Management**: Channels are properly cleaned up on component unmount

## Troubleshooting

### Tickets not updating in real-time

1. Check Supabase connection in browser console
2. Verify environment variables are correct
3. Ensure broadcast permissions are enabled in Supabase

### High latency

1. Consider reducing `maxTickets` for better performance
2. Check your Supabase plan limits for realtime connections

## Security

- Ticket broadcasts are read-only for clients
- Only authenticated users can create tickets
- Server-side validation ensures data integrity