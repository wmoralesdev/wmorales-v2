import { notFound, redirect } from 'next/navigation';
import { getPollByCode, getPollResults, getUserVotes } from '@/app/actions/poll.actions';
import { PollVoting } from '@/components/polls/poll-voting';
import { createClient } from '@/lib/supabase/server';
import type { PollWithQuestions } from '@/lib/types/poll.types';

export default async function PollPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login with return URL
    redirect(`/login?returnTo=/polls/${code}`);
  }

  const { data: poll, error } = await getPollByCode(code);

  if (error || !poll) {
    notFound();
  }

  // Get initial results
  const { data: results } = await getPollResults(poll.id);

  // Get user's votes
  const { data: userVotes } = await getUserVotes(poll.id);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <PollVoting
        initialResults={results || undefined}
        initialUserVotes={userVotes || undefined}
        poll={poll as PollWithQuestions}
      />
    </div>
  );
}
