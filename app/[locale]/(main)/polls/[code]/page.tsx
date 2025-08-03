import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  getAllPolls,
  getPollByCode,
  getPollResults,
  getUserVotes,
} from '@/app/actions/poll.actions';
import { PollVoting } from '@/components/polls/poll-voting';
import { createMetadata, siteConfig } from '@/lib/metadata';
import { createClient } from '@/lib/supabase/server';
import type { PollWithQuestions } from '@/lib/types/poll.types';

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export async function generateStaticParams() {
  try {
    const polls = await getAllPolls();

    // Generate params for all locales and all active polls
    return routing.locales.flatMap((locale) =>
      polls.map((poll) => ({
        locale,
        code: poll.code,
      }))
    );
  } catch (error) {
    // Error generating static params for polls
    return [];
  }
}

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
  const description =
    poll.description ||
    `Live voting poll: ${poll.title}. Join and vote in real-time!`;

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
  const { locale, code } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const { data: poll, error } = await getPollByCode(code);

  if (error || !poll) {
    notFound();
  }

  // Fetch poll results and user votes in parallel (Next.js 15 advantage)
  const [resultsResponse, userVotesResponse] = await Promise.all([
    getPollResults(poll.id),
    getUserVotes(poll.id),
  ]);

  const results = resultsResponse.data;
  const userVotes = userVotesResponse.data;

  return (
    <div className="min-h-screen">
      <PollVoting
        initialResults={results || undefined}
        initialUserVotes={userVotes || undefined}
        poll={poll as PollWithQuestions}
      />
    </div>
  );
}
