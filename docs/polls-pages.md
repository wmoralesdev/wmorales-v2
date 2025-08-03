# Polls Pages (/polls) - README

## Overview

The Live Polls system enables real-time voting and audience engagement during events and presentations. It features interactive polling with live results, user presence indicators, and comprehensive analytics for event organizers.

## Page Structure

### Polls Index (/polls)

- **Route**: `/polls` (app/(main)/polls/page.tsx)
- **Purpose**: Main polls directory with active and past polls listing

### Individual Poll (/polls/[code])

- **Route**: `/polls/[code]` (app/(main)/polls/[code]/page.tsx)
- **Purpose**: Interactive voting interface with real-time results

## Features

### Polls Index Features

- **Active Polls Directory**: Browse available polls with participation counts
- **Poll Statistics**: Display question count and session participation
- **Responsive Cards**: Clean card-based layout with poll metadata
- **Empty State**: Developer-friendly guidance for poll creation
- **Dynamic Loading**: Server-side rendering with dynamic data updates

### Individual Poll Features

- **Real-time Voting**: Live vote submission with instant feedback
- **Live Results**: Real-time result updates across all participants
- **User Presence**: See who's currently active in the poll
- **Vote History**: Track individual voting patterns and changes
- **Multi-question Support**: Support for multiple questions per poll
- **Authentication Required**: Secure voting with user authentication

## Technical Implementation

### Real-time Architecture

- **Supabase Realtime**: WebSocket connections for live vote synchronization
- **Presence Tracking**: Real-time user presence in poll sessions
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Conflict Resolution**: Handle simultaneous voting and result updates
- **Connection Management**: Automatic reconnection and error handling

### Authentication System

- **Required Authentication**: Users must be logged in to participate
- **Redirect Handling**: Automatic redirect to login with return URL
- **Vote Attribution**: All votes tied to authenticated user accounts
- **Session Management**: Persistent voting sessions across page refreshes

### Database Schema

Poll system built with Prisma including:

- **Poll Model**: Poll metadata, code, and configuration
- **Question Model**: Individual poll questions with options
- **Vote Model**: User vote records with timestamps
- **Session Model**: Poll participation tracking

## Components Architecture

### PollsList Component

- **Poll Grid**: Responsive grid layout of available polls
- **Poll Cards**: Interactive cards with hover effects and metadata
- **Navigation**: Direct links to individual poll voting interfaces
- **Loading States**: Skeleton loading for poll data fetching

### PollVoting Component

- **Question Display**: Clear presentation of poll questions and options
- **Vote Interface**: Interactive voting controls with visual feedback
- **Results Dashboard**: Real-time charts and statistics
- **User Presence**: Live indicator of active participants
- **Progress Tracking**: Visual progress through multi-question polls

### PollResultsDashboard Component

- **Live Charts**: Real-time updating vote visualizations
- **Statistics Panel**: Comprehensive voting analytics
- **Export Features**: Data export for poll analysis
- **Historical Data**: Vote trends and participation patterns

## File Structure

```
app/(main)/polls/
├── page.tsx                    # Polls index with listing
├── metadata.ts                 # SEO configuration
├── [code]/
│   └── page.tsx               # Individual poll voting
└── actions/
    └── poll.actions.ts        # Server actions for poll operations

components/polls/
├── polls-list.tsx             # Polls directory listing
├── poll-voting.tsx            # Main voting interface
├── poll-results-dashboard.tsx # Real-time results display
└── hooks/
    ├── use-poll-presence.ts   # Presence tracking hook
    └── use-poll-results-swr.ts # SWR for results data
```

## Real-time Features

### Live Voting

- **Instant Updates**: Votes appear immediately across all sessions
- **Visual Feedback**: Smooth animations for vote submissions
- **Progress Bars**: Live updating progress for each option
- **Vote Counts**: Real-time participant and vote counters

### Presence System

- **Active Users**: Display currently active poll participants
- **Join/Leave Events**: Real-time participant tracking
- **Presence Indicators**: Visual indicators for user activity
- **Session Management**: Handle user disconnections gracefully

### Result Synchronization

- **Cross-user Sync**: Results synchronized across all participants
- **Historical Accuracy**: Maintain vote history and audit trails
- **Performance Optimization**: Efficient real-time data updates
- **Scalability**: Support for high-participation polls

## Poll Management

### Poll Creation

- **Administrative Interface**: Backend poll creation and management
- **Question Builder**: Support for multiple question types
- **Option Configuration**: Flexible option setup and validation
- **Code Generation**: Unique poll codes for easy access

### Poll Configuration

- **Multiple Questions**: Support for complex multi-question polls
- **Time Limits**: Optional voting time restrictions
- **Access Control**: Public vs restricted poll access
- **Result Visibility**: Configure when results become visible

## Analytics & Insights

### Participation Metrics

- **Vote Counts**: Track total votes per question and option
- **Session Analytics**: Monitor user participation patterns
- **Time-based Analysis**: Vote timing and participation flows
- **Engagement Metrics**: Measure poll effectiveness and engagement

### Real-time Dashboard

- **Live Statistics**: Real-time participation and voting data
- **Visual Charts**: Interactive charts and graphs for results
- **Export Capabilities**: Data export for post-event analysis
- **Historical Trends**: Long-term polling data analysis

## Performance Optimizations

- **SWR Integration**: Smart data fetching with automatic revalidation
- **Optimistic Updates**: Immediate UI updates with background sync
- **Connection Pooling**: Efficient WebSocket connection management
- **Caching Strategy**: Strategic caching for poll metadata and results

## Security Features

- **Authentication Required**: All poll access requires user login
- **Vote Validation**: Server-side validation of all vote submissions
- **Rate Limiting**: Prevent spam voting and abuse
- **Audit Trail**: Complete vote history and user activity logging

## Event Integration

- **Event-specific Polls**: Polls can be tied to specific events
- **QR Code Access**: Generate QR codes for easy poll access
- **Mobile Optimization**: Touch-friendly interfaces for mobile devices
- **Offline Resilience**: Graceful handling of connectivity issues

## Development Tools

- **Seeding Scripts**: Developer tools for creating sample polls
- **Testing Framework**: Comprehensive testing for real-time features
- **Monitoring**: Real-time monitoring of poll performance
- **Debug Tools**: Development tools for troubleshooting real-time issues
