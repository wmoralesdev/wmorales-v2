import { Sparkles } from 'lucide-react';
import { PollsList } from '@/components/polls/polls-list';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

async function getPolls() {
  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          sessions: true,
          questions: true,
        },
      },
    },
  });

  return polls;
}

export default async function PollsPage() {
  const polls = await getPolls();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        </div>

        {/* Content */}
        <div className="container relative mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text font-bold text-5xl text-transparent">
              Live polls
            </h1>
            <p className="mx-auto max-w-2xl text-gray-400 text-lg">
              Vote with fellow attendees and see the results in real-time
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No polls created yet. Run <code className="rounded bg-muted px-2 py-1">pnpm seed:poll</code> to create a
                sample poll.
              </p>
            </CardContent>
          </Card>
        ) : (
          <PollsList polls={polls} />
        )}
      </div>
    </div>
  );
}
