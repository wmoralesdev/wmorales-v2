'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { broadcastEventUpdate } from '@/lib/supabase/realtime-server';
import { createClient } from '@/lib/supabase/server';

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  maxImages: z.number().min(1).max(50).default(15),
  endsAt: z.string().datetime().optional(),
});

const uploadImageSchema = z.object({
  eventId: z.string().uuid(),
  imageUrl: z.string().url(),
  caption: z.string().optional(),
});

// Create a new event
export async function createEvent(data: z.infer<typeof createEventSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const validatedData = createEventSchema.parse(data);

  const event = await prisma.event.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      maxImages: validatedData.maxImages,
      endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
    },
  });

  return event;
}

// Get event by QR code
export async function getEventByQRCode(qrCode: string) {
  const event = await prisma.event.findUnique({
    where: { qrCode },
    include: {
      images: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (!event.isActive) {
    throw new Error('Event is not active');
  }

  if (event.endsAt && new Date() > event.endsAt) {
    throw new Error('Event has ended');
  }

  return event;
}

// Get event by ID
export async function getEventById(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      images: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  return event;
}

// Upload image to event
export async function uploadEventImage(data: z.infer<typeof uploadImageSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const validatedData = uploadImageSchema.parse(data);

  // Check if event exists and is active
  const event = await prisma.event.findUnique({
    where: { id: validatedData.eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (!event.isActive) {
    throw new Error('Event is not active');
  }

  if (event.endsAt && new Date() > event.endsAt) {
    throw new Error('Event has ended');
  }

  // Check if user has reached the maximum number of images
  const userImageCount = await prisma.eventImage.count({
    where: {
      eventId: validatedData.eventId,
      userId: user.id,
    },
  });

  if (userImageCount >= event.maxImages) {
    throw new Error(`Maximum number of images (${event.maxImages}) reached for this event`);
  }

  // Create the image record
  const image = await prisma.eventImage.create({
    data: {
      eventId: validatedData.eventId,
      userId: user.id,
      imageUrl: validatedData.imageUrl,
      caption: validatedData.caption,
    },
  });

  // Broadcast the new image upload
  await broadcastEventUpdate({
    type: 'image_uploaded',
    eventId: validatedData.eventId,
    image: {
      id: image.id,
      imageUrl: image.imageUrl,
      caption: image.caption || undefined,
      createdAt: image.createdAt.toISOString(),
    },
    timestamp: new Date().toISOString(),
  });

  return image;
}

// Get user's images for an event
export async function getUserEventImages(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const images = await prisma.eventImage.findMany({
    where: {
      eventId,
      userId: user.id,
    },
    orderBy: { createdAt: 'desc' },
  });

  return images;
}

// Delete user's image
export async function deleteEventImage(imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Check if image belongs to user
  const image = await prisma.eventImage.findFirst({
    where: {
      id: imageId,
      userId: user.id,
    },
  });

  if (!image) {
    throw new Error('Image not found or not authorized');
  }

  // Delete from Supabase storage
  await supabase.storage.from('event-images').remove([image.imageUrl]);

  // Delete from database
  await prisma.eventImage.delete({
    where: { id: imageId },
  });

  // Broadcast the image deletion
  await broadcastEventUpdate({
    type: 'image_deleted',
    eventId: image.eventId,
    imageId,
    timestamp: new Date().toISOString(),
  });

  return { success: true };
}

// Get all active events
export async function getActiveEvents() {
  const events = await prisma.event.findMany({
    where: {
      isActive: true,
      OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { images: true },
      },
    },
  });

  return events;
}

// Generate upload URL for Supabase storage
export async function generateUploadURL(eventId: string, fileName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Validate event exists and is active
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event?.isActive) {
    throw new Error('Event not found or not active');
  }

  const filePath = `${eventId}/${user.id}/${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage.from('event-images').createSignedUploadUrl(filePath);

  if (error) {
    throw new Error('Failed to generate upload URL');
  }

  return {
    uploadUrl: data.signedUrl,
    filePath,
  };
}
