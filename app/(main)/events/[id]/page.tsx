import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getEventById } from '@/app/actions/events.actions';
import { EventGallery } from '@/components/events/event-gallery';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await getEventById(id);
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

export default async function EventPage({ params }: Props) {
  try {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl">
              {event.title}
            </h1>
            {event.description && <p className="mt-2 text-gray-400 text-sm sm:text-base">{event.description}</p>}
          </div>

          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
                  Loading gallery...
                </div>
              </div>
            }
          >
            <EventGallery
              event={{
                ...event,
                images: event.images.map((img) => ({
                  ...img,
                  caption: img.caption ?? undefined,
                })),
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
