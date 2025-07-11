import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getEventById } from '@/app/actions/events.actions';
import { EventGallery } from '@/components/events/event-gallery';

type EventPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  try {
    const event = await getEventById(params.id);
    return {
      title: `${event.title} - Event Gallery`,
      description: event.description || `View and share photos from ${event.title}`,
    };
  } catch {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found',
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  try {
    const event = await getEventById(params.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <h1 className='bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl'>
              {event.title}
            </h1>
            {event.description && <p className='mt-2 text-gray-400 text-sm sm:text-base'>{event.description}</p>}
          </div>

          <Suspense
            fallback={
              <div className='flex h-64 items-center justify-center'>
                <div className='flex items-center gap-2 text-gray-400'>
                  <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
                  Loading gallery...
                </div>
              </div>
            }
          >
            <EventGallery event={event} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
