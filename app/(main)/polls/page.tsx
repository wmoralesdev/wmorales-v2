import { Activity } from 'lucide-react';
import { InnerHero } from '@/components/common/inner-hero';
import { PollsList } from '@/components/polls/polls-list';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

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
      <InnerHero
        description="Vote with fellow attendees and see the results in real-time"
        icon={Activity}
        title="Live Polls"
      />

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
