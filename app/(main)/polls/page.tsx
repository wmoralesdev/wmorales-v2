import { PollsList } from '@/components/polls/polls-list';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Live polls</h1>
        <p className="text-muted-foreground">Vote with fellow attendees and see the results in real-time</p>
      </div>

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
  );
}
