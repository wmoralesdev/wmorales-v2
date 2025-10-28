import type { Event, EventContent, EventImage } from "@prisma/client";

export type ExtendedEvent = EventImage & {
  profile: {
    name: string;
    avatar?: string;
  };
};

// Event types with includes
export type EventWithContent = Event & {
  content: EventContent[];
};

export type EventWithContentAndImages = Event & {
  content: EventContent[];
  images: ExtendedEventImage[];
  contributors: number;
};

export type EventFullDetails = Event & {
  content: EventContent[];
  images: ExtendedEvent[];
  contributors: number;
};

// Component prop types
export type EventGalleryProps = {
  event: EventWithContentAndImages;
  initialUserImages?: UserEventImage[];
};

export type PostEventViewProps = {
  event: EventWithContentAndImages;
};

// User event image type (from hook)
export type UserEventImage = {
  id: string;
  eventId: string;
  profileId: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
};

export type ExtendedEventImage = EventImage & {
  profile: {
    name: string;
    avatar?: string;
  };
};

// View modes for post-event view
export type ViewMode = "grid" | "slideshow" | "timeline";

// Stats display types
export type EventStatsData = {
  totalPhotos: number;
  contributors: number;
  eventDate?: Date;
  createdAt: Date;
};
