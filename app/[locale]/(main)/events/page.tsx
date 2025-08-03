import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getActiveEvents } from '@/app/actions/events.actions';
import { EventsList } from '@/components/events/events-list';

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const events = await getActiveEvents();

  // Get translations
  const t = await getTranslations('events');
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="sm:container mx-auto px-0 sm:px-4 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="mb-6 sm:mb-8 px-4 sm:px-0">
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            {t('description')}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
                {t('loadingEvents')}
              </div>
            </div>
          }
        >
          <EventsList events={events} />
        </Suspense>
      </div>
    </div>
  );
}
