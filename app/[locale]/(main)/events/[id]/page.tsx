import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Sparkles } from 'lucide-react';
// TODO: import { getEventBySlug } from '@/app/actions/events.actions';
// TODO: import { EventGallery } from '@/components/events/event-gallery';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// TODO: This needs to be updated for the new Event + EventContent model
// For now, we'll skip metadata generation to avoid build errors
// This will be handled in a separate update to server actions

export default async function EventPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations('events');

  // TODO: Update this to use getEventBySlug with new Event + EventContent model
  // For now, return a placeholder to avoid build errors
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl">
            Event Gallery
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            {t('description')}
          </p>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 animate-pulse text-purple-400" />
            <p className="text-gray-400">Event page will be updated after server actions are migrated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
