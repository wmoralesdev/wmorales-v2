# Real-time Polls Feature Documentation

## Overview

The polls feature has been refactored to include real-time functionality using Supabase's websocket capabilities. The system now provides:

1. **Real-time vote updates** - Results update instantly as users vote
2. **Active user tracking** - See how many users are currently viewing each poll
3. **Results dashboard** - Beautiful dashboard shown after completing all questions
4. **Presence tracking** - Live indicators showing active participants
5. **Authentication requirement** - Only authenticated users can participate in polls
6. **Single submission** - Submit all answers at once with validation

## Architecture

### Components

1. **PollVoting** (`components/polls/poll-voting.tsx`)

   - Handles the voting interface
   - Tracks user progress through questions
   - Shows results inline if enabled
   - Single submit button for all questions
   - Validation for unanswered questions
   - Transitions to dashboard after completion

2. **PollResultsDashboard** (`components/polls/poll-results-dashboard.tsx`)

   - Displays comprehensive results after voting
   - Shows real-time updates as new votes come in
   - Displays active viewer count
   - Two view modes: Overview and Detailed Results

3. **PollsList** (`components/polls/polls-list.tsx`)
   - Lists all available polls
   - Shows live user count for each active poll
   - Real-time updates via websockets

### Real-time Features

1. **Websocket Subscriptions**

   - Poll updates channel: `poll:{pollCode}`
   - Active users channel: `polls:active`
   - Presence tracking for each poll

2. **Event Types**
   - `vote_added` - New vote submitted
   - `vote_removed` - Vote removed (if implemented)
   - `poll_closed` - Poll has been closed
   - `results_updated` - Results have changed

### Data Flow

1. User submits vote → Server action → Database update
2. Server broadcasts update event via Supabase
3. All connected clients receive update
4. Components fetch fresh data and update UI
5. Presence is tracked and broadcast periodically

## Usage

### Authentication

- Users must be authenticated to participate in polls
- Unauthenticated users are redirected to login with return URL
- After login, users are redirected back to the poll

### Viewing Polls List

- Navigate to `/polls`
- See all polls with live user counts
- Active polls show green "live" indicator
- Unique voter count shows actual participants (not vote count)

### Participating in a Poll

- Navigate to `/polls/{code}`
- Answer all questions before submitting
- Visual indicators show answered questions
- Single "Submit All Answers" button at the bottom
- Validation ensures all questions are answered
- View comprehensive dashboard after completion

### Real-time Updates

- Results update automatically as others vote
- No need to refresh the page
- Active user count updates every 10 seconds
- Smooth animations for all changes

## Key Features

### Authentication Integration

- Seamless redirect to login with return URL
- Supports Google and GitHub OAuth
- User votes tracked across devices
- Session management for consistent experience

### Improved UX

- Progress indicator shows completion status
- Answered questions are visually marked
- Validation messages for missing answers
- Single submission reduces complexity
- Responsive design for all devices

### Accurate Analytics

- Unique voters count based on sessions
- Merge votes from same user across devices
- Real participant tracking (not vote count)

## Technical Details

### Presence Tracking

- Uses `usePollPresence` hook
- Broadcasts active user count every 10 seconds
- Cleans up when user leaves page

### State Management

- Local state for UI updates
- Server state for source of truth
- Optimistic updates where appropriate

### Performance

- Debounced updates to prevent flickering
- Efficient re-renders using React hooks
- Minimal network traffic with broadcast events

## Future Enhancements

1. **Vote Analytics**

   - Time-based voting patterns
   - Geographic distribution
   - Device/browser statistics

2. **Advanced Features**

   - Private polls with access codes
   - Scheduled polls
   - Export results to CSV/PDF

3. **Moderation**
   - Admin controls to pause/resume voting
   - Remove inappropriate responses
   - Block specific sessions

## Environment Setup

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The real-time features require:

- Supabase project with real-time enabled
- Proper CORS configuration
- WebSocket support in hosting environment
- Authentication providers configured (Google, GitHub)
