import { notFound, redirect } from 'next/navigation';
import { getPollByCode, getPollResults, getUserVotes } from '@/app/actions/poll.actions';
import { PollVoting } from '@/components/polls/poll-voting';
import { createClient } from '@/lib/supabase/server';
import type { PollWithQuestions } from '@/lib/types/poll.types';

export default async function PollPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?returnTo=/polls/${code}`);
  }

  const { data: poll, error } = await getPollByCode(code);

  if (error || !poll) {
    notFound();
  }

  const { data: results } = await getPollResults(poll.id);

  const { data: userVotes } = await getUserVotes(poll.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PollVoting
        initialResults={results || undefined}
        initialUserVotes={userVotes || undefined}
        poll={poll as PollWithQuestions}
      />
    </div>
  );
}
