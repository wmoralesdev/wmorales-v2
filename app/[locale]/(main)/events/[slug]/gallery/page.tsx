import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/app/actions/events.actions';
import { ArtisticGallery } from '@/components/events/artistic-gallery';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;

  try {
    const event = await getEventBySlug(slug);
    const eventContent =
      event.content.find((c) => c.language === locale) || event.content[0];

    return {
      title: `${eventContent.title} - Gallery`,
      description: eventContent.description || 'Event photo gallery',
    };
  } catch {
    return {
      title: 'Gallery Not Found',
      description: 'This gallery could not be found.',
    };
  }
}

export default async function EventGalleryPage({ params }: Props) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  try {
    // Fetch event data
    const event = await getEventBySlug(slug);

    // Get the localized content
    const eventContent =
      event.content.find((c) => c.language === locale) || event.content[0];

    return (
      <ArtisticGallery
        event={event}
        eventContent={eventContent}
        locale={locale}
      />
    );
  } catch (error) {
    notFound();
  }
}
