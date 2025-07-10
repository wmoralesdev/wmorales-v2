import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventGallery } from '@/components/events/event-gallery';
import { getEventById } from '@/app/actions/events.actions';

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
          {event.description && (
            <p className="text-muted-foreground mt-2">{event.description}</p>
          )}
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading gallery...</div>}>
          <EventGallery event={event} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}