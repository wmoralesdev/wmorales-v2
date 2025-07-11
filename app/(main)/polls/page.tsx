import { Activity } from 'lucide-react';
import { InnerHero } from '@/components/common/inner-hero';
import { PollsList } from '@/components/polls/polls-list';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export { metadata } from './metadata';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <InnerHero
        description="Vote with fellow attendees and see the results in real-time"
        icon={Activity}
        title="Live Polls"
      />

      <div className="container mx-auto px-4 py-8 pt-16">
        {polls.length === 0 ? (
          <Card className='border-gray-800 bg-gray-900/80 backdrop-blur-xl'>
            <CardContent className="py-8">
              <p className="text-center text-gray-400">
                No polls created yet. Run{' '}
                <code className="rounded bg-purple-500/20 px-2 py-1 text-purple-300">pnpm seed:poll</code> to create a
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
