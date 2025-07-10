import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPollByCode, getPollResults, getUserVotes } from '@/app/actions/poll.actions';
import { PollVoting } from '@/components/polls/poll-voting';
import { createMetadata, siteConfig } from '@/lib/metadata';
import { createClient } from '@/lib/supabase/server';
import type { PollWithQuestions } from '@/lib/types/poll.types';

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const { data: poll } = await getPollByCode(code);

  if (!poll) {
    return createMetadata({
      title: 'Poll Not Found',
      description: 'The requested poll could not be found.',
    });
  }

  const title = poll.title;
  const description = poll.description || `Live voting poll: ${poll.title}. Join and vote in real-time!`;

  return createMetadata({
    title,
    description,
    openGraph: {
      title: `${title} | Live Poll`,
      description,
      url: `${siteConfig.url}/polls/${code}`,
      type: 'website',
    },
    twitter: {
      title: `${title} | Live Poll`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/polls/${code}`,
    },
  });
}

export default async function PollPage({ params }: Props) {
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
