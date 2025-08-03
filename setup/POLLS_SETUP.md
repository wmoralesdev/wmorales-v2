# Live Polls Feature Documentation

## Overview

The Live Polls feature enables real-time voting with instant results updates. Unlike surveys which are form-based and comprehensive, polls are designed for quick, interactive voting experiences where participants can see results update in real-time as others vote.

## Key Features

- **Real-time Updates**: Results update instantly using Supabase Realtime
- **Anonymous Voting**: No login required, session-based tracking
- **Multiple Question Types**: Single choice and multiple choice questions
- **Visual Results**: Animated progress bars with emojis and colors
- **Shareable Links**: Short codes for easy sharing
- **Vote Prevention**: Prevents duplicate voting per session
- **Results Control**: Option to show/hide results with delay

## Database Schema

The polls feature uses these Prisma models:

- `Poll`: Main poll metadata with settings
- `PollQuestion`: Questions within a poll
- `PollOption`: Answer options with visual customization
- `PollVote`: Individual votes
- `PollSession`: Tracks voting sessions

## Setup Instructions

### 1. Run Database Migration

If you haven't already, run the Prisma migration to create the poll tables:

```bash
pnpm prisma:migrate
```

### 2. Seed a Sample Poll

Create a sample poll to test the feature:

```bash
pnpm seed:poll
```

This creates a poll with:

- Single choice question: "Which feature would you like to see next?"
- Multiple choice question: "What technologies are you interested in?"

The console will output the poll URL.

### 3. Access the Poll

Polls can be accessed via:

- Direct link: `/polls/[code]` (e.g., `/polls/clxyz123`)
- Admin list: `/polls` (shows all polls)

## Architecture

### Components

1. **PollVoting** (`components/polls/poll-voting.tsx`)
   - Main voting interface
   - Handles real-time updates
   - Manages vote submission
   - Animated results display

2. **PollsList** (`components/polls/polls-list.tsx`)
   - Admin view of all polls
   - Copy shareable links
   - View poll status

### Server Actions

- `createPoll()` - Create a new poll
- `getPollByCode()` - Fetch poll by shareable code
- `votePoll()` - Submit a vote
- `getPollResults()` - Get current results
- `getUserVotes()` - Get user's votes for a poll

### Real-time Updates

Uses Supabase Realtime broadcasting:

```typescript
// Subscribe to updates
const channel = subscribeToPollUpdates(pollCode, (event) => {
  // Handle real-time vote updates
});

// Broadcast updates (handled in server actions)
broadcastPollUpdate(pollCode, event);
```

## Creating a Poll Programmatically

```typescript
await createPoll({
  title: 'Your Poll Title',
  description: 'Optional description',
  questions: [
    {
      question: 'Your question?',
      type: 'single',
      options: [
        {
          label: 'Option 1',
          value: 'opt1',
          emoji: '🎯',
          color: 'bg-blue-500/20',
        },
        // More options...
      ],
    },
  ],
  settings: {
    showResults: true, // Show results to voters
    allowMultiple: false, // Allow changing vote
    resultsDelay: 0, // Delay before showing results (seconds)
  },
});
```

## Poll Settings

### showResults

- `true`: Voters can see results immediately
- `false`: Only poll creator can see results

### allowMultiple

- `true`: Users can change their vote
- `false`: Vote is final once submitted

### resultsDelay

- Number of seconds to wait after voting before showing results
- Useful for preventing bias in early voting

## Session Management

Polls use browser sessions to track voters:

- Cookie-based session ID (`poll_session_id`)
- 30-day expiration
- No personal data collected
- IP addresses are hashed for fraud prevention

## Deployment Considerations

### Vercel Deployment

The feature is optimized for Vercel:

- Real-time updates work via Supabase
- No additional websocket server needed
- Scales automatically

### Environment Variables

Ensure these are set in production:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Customization

### Visual Customization

Options support:

- **emoji**: Display emoji next to option
- **color**: Tailwind color class for result bars

Example:

```typescript
{
  label: 'Great!',
  value: 'great',
  emoji: '🎉',
  color: 'bg-green-500/20'
}
```

### Question Types

1. **Single Choice** (`type: 'single'`)
   - Radio buttons
   - One selection allowed

2. **Multiple Choice** (`type: 'multiple'`)
   - Checkboxes
   - Set `maxSelections` to limit choices

## Best Practices

1. **Keep polls focused**: 1-3 questions maximum
2. **Use emojis**: Makes options more engaging
3. **Set appropriate delays**: Prevent early vote bias
4. **Monitor results**: Check `/polls` for participation
5. **Share wisely**: Use short codes for easy sharing

## Troubleshooting

### Votes not updating in real-time

1. Check Supabase Realtime is enabled
2. Verify environment variables
3. Check browser console for errors

### Can't vote

1. Clear cookies/session
2. Check if poll is active
3. Verify you haven't already voted

### Results not showing

1. Check `showResults` setting
2. Wait for `resultsDelay` if set
3. Verify at least one vote exists

## Future Enhancements

- [ ] Poll templates
- [ ] Scheduled polls
- [ ] Export results
- [ ] QR code generation
- [ ] Embed widget
- [ ] Analytics dashboard
- [ ] Vote verification (email/SMS)
- [ ] Custom branding
