import { Activity } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { InnerHero } from '@/components/common/inner-hero';
import { PollsList } from '@/components/polls/polls-list';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export { metadata } from './metadata';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

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

export default async function PollsPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations('polls');
  
  const polls = await getPolls();

  return (
    <div className="min-h-screen">
      <InnerHero
        description={t('description')}
        icon={Activity}
        title={t('title')}
      />

      <div className="container mx-auto px-4 py-8 pt-16">
        {polls.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardContent className="py-8">
              <p className="text-center text-gray-400">
                {t('noPolls')}
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
