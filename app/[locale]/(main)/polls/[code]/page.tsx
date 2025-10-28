import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getPollByCode,
  getPollResults,
  getUserVotes,
} from "@/app/actions/poll.actions";
import { PollVoting } from "@/components/polls/poll-voting";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { PollWithQuestions } from "@/lib/types/poll.types";

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, code } = await params;
  const { data: poll } = await getPollByCode(code);
  const t = await getTranslations({ locale, namespace: "polls" });

  if (!poll) {
    return createMetadata({
      title: t("pollNotFound"),
      description: t("pollNotFoundDescription"),
    });
  }

  const title = poll.title;
  const description =
    poll.description || t("liveVotingDescription", { title: poll.title });

  const livePollSuffix = t("livePollSuffix");

  return createMetadata({
    title,
    description,
    openGraph: {
      title: `${title} | ${livePollSuffix}`,
      description,
      url: `${siteConfig.url}/polls/${code}`,
      type: "website",
    },
    twitter: {
      title: `${title} | ${livePollSuffix}`,
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
