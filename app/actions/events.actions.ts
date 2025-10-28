"use server";

import type { Event, EventContent, EventImage } from "@prisma/client";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { EVENT_IMAGES_BUCKET } from "@/lib/consts";
import { db } from "@/lib/db-utils";
import { broadcastEventUpdate } from "@/lib/supabase/realtime-server";
import { createClient } from "@/lib/supabase/server";
import type { ExtendedEventImage } from "@/lib/types/event.types";

// Validation schemas
const createEventSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  content: z
    .array(
      z.object({
        language: z.string().min(1, "Language is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one language content is required"),
  maxImages: z.number().min(1).max(50).default(15),
  endsAt: z.string().datetime().optional(),
});

const uploadImageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().url(),
  caption: z.string().optional(),
});

// Create a new event
export async function createEvent(
  data: z.infer<typeof createEventSchema>
): Promise<Event & { content: EventContent[] }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const validatedData = createEventSchema.parse(data);

  const event = await db.query(() =>
    db.client.event.create({
      data: {
        slug: validatedData.slug,
        maxImages: validatedData.maxImages,
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
        content: {
          create: validatedData.content.map((content) => ({
            language: content.language,
            title: content.title,
            description: content.description,
          })),
        },
      },
      include: {
        content: true,
      },
    })
  );

  return event;
}

// Get event by QR code with Prisma types
export async function getEventByQRCode(
  qrCode: string
): Promise<Event & { content: EventContent[]; images: EventImage[] }> {
  const event = await db.query(() =>
    db.client.event.findUnique({
      where: { qrCode },
      include: {
        content: true,
        images: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })
  );

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.isActive) {
    throw new Error("Event is not active");
  }

  if (event.endsAt && new Date() > event.endsAt) {
    throw new Error("Event has ended");
  }

  return event;
}

// Get event by ID with Prisma types
export async function getEventById(
  eventId: string
): Promise<Event & { content: EventContent[]; images: EventImage[] }> {
  const event = await db.query(() =>
    db.client.event.findUnique({
      where: { id: eventId },
      include: {
        content: true,
        images: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}

// Get event by slug with Prisma types
export async function getEventBySlug(slug: string): Promise<
  Event & {
    content: EventContent[];
    images: ExtendedEventImage[];
    contributors: number;
  }
> {
  const locale = await getLocale();

  const event = await db.query(() =>
    db.client.event.findUnique({
      where: { slug },
      include: {
        content: {
          where: {
            language: locale,
          },
        },
        images: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            profile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })
  );

  if (!event) {
    throw new Error("Event not found");
  }

  // Count distinct users who have uploaded images
  const uniqueUsers = new Set(event.images.map((img) => img.profileId));

  return {
    ...event,
    images: event.images.map((img) => ({
      ...img,
      caption: img.caption || null,
      profile: {
        name: img.profile.name || "Unknown",
        avatar: img.profile.avatar || undefined,
      },
    })),
    contributors: uniqueUsers.size,
  };
}

// Upload image to event
export async function uploadEventImage(
  data: z.infer<typeof uploadImageSchema>
): Promise<EventImage> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const validatedData = uploadImageSchema.parse(data);

  // Check if event exists and is active
  const event = await db.query(() =>
    db.client.event.findUnique({
      where: { slug: validatedData.slug },
    })
  );

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.isActive) {
    throw new Error("Event is not active");
  }

  if (event.endsAt && new Date() > event.endsAt) {
    throw new Error("Event has ended");
  }

  // Check if user has reached the maximum number of images
  const userImageCount = await db.query(() =>
    db.client.eventImage.count({
      where: {
        eventId: event.id,
        profileId: user.id,
      },
    })
  );

  if (userImageCount >= event.maxImages) {
    throw new Error(
      `Maximum number of images (${event.maxImages}) reached for this event`
    );
  }

  // Create the image record
  const image = await db.query(() =>
    db.client.eventImage.create({
      data: {
        eventId: event.id,
        profileId: user.id,
        imageUrl: validatedData.imageUrl,
        caption: validatedData.caption,
      },
      include: {
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })
  );

  // Broadcast the new image upload (don't fail the upload if broadcast fails)
  try {
    await broadcastEventUpdate({
      type: "image_uploaded",
      eventId: event.id,
      image: {
        id: image.id,
        imageUrl: image.imageUrl,
        caption: image.caption || undefined,
        createdAt: image.createdAt.toISOString(),
        profileId: image.profileId,
        profile: {
          name: image.profile.name || "Unknown",
          avatar: image.profile.avatar || undefined,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (broadcastError) {
    // Log the error but don't fail the upload
    console.error("Failed to broadcast image upload:", broadcastError);
  }

  return image;
}

// Get user's images for an event
export async function getUserEventImages(
  eventId: string
): Promise<EventImage[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const images = await db.query(() =>
    db.client.eventImage.findMany({
      where: {
        eventId,
        profileId: user.id,
      },
      orderBy: { createdAt: "desc" },
    })
  );

  return images;
}

// Delete user's image
export async function deleteEventImage(imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if image belongs to user
  const image = await db.query(() =>
    db.client.eventImage.findFirst({
      where: {
        id: imageId,
        profileId: user.id,
      },
    })
  );

  if (!image) {
    throw new Error("Image not found or not authorized");
  }

  // Delete from Supabase storage
  await supabase.storage.from("event-images").remove([image.imageUrl]);

  // Delete from database
  await db.query(() =>
    db.client.eventImage.delete({
      where: { id: imageId },
    })
  );

  // Broadcast the image deletion (don't fail the deletion if broadcast fails)
  try {
    await broadcastEventUpdate({
      type: "image_deleted",
      eventId: image.eventId,
      imageId,
      timestamp: new Date().toISOString(),
    });
  } catch (broadcastError) {
    // Log the error but don't fail the deletion
    console.error("Failed to broadcast image deletion:", broadcastError);
  }

  return { success: true };
}

export async function downloadEventPhotos(eventSlug: string) {
  "use server";

  try {
    // Get the event with all images
    const event = await db.query(() =>
      db.client.event.findUnique({
        where: { slug: eventSlug },
        include: {
          images: true,
        },
      })
    );

    if (!event) {
      throw new Error("Event not found");
    }

    // In a real implementation, you would:
    // 1. Create a zip file with all images
    // 2. Upload it to a temporary storage
    // 3. Return a download URL

    // For now, we'll just return the image URLs
    return {
      success: true,
      images: event.images.map((img: EventImage) => img.imageUrl),
      count: event.images.length,
    };
  } catch (error) {
    console.error("Failed to prepare download:", error);
    throw new Error("Failed to prepare photos for download");
  }
}

// Get all active events
export async function getActiveEvents(): Promise<
  (Event & { content: EventContent[]; images: EventImage[] })[]
> {
  const locale = await getLocale();

  const events = await db.query(() =>
    db.client.event.findMany({
      where: {
        isActive: true,
        OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        content: {
          where: {
            language: locale,
          },
        },
        images: true,
      },
    })
  );

  return events;
}

// Generate upload URL for Supabase storage
export async function generateUploadURL(slug: string, fileName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!slug) {
    throw new Error("Slug is required");
  }

  // Validate event exists and is active
  const event = await db.query(() =>
    db.client.event.findUnique({
      where: { slug },
    })
  );

  if (!event?.isActive) {
    throw new Error("Event not found or not active");
  }

  const filePath = `${slug}/${user.id}/${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(EVENT_IMAGES_BUCKET)
    .createSignedUploadUrl(filePath);

  if (error) {
    throw new Error("Failed to generate upload URL");
  }

  return {
    uploadUrl: data.signedUrl,
    filePath,
  };
}
