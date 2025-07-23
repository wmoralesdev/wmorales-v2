'use server';

import { openai } from '@ai-sdk/openai';
import type { GuestbookEntry, GuestbookTicket } from '@prisma/client';
import { generateObject } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { broadcastGuestbookUpdate } from '@/lib/supabase/realtime-server';
import { createClient } from '@/lib/supabase/server';

// Color palette schema for AI generation
const colorPaletteSchema = z.object({
  primaryColor: z.string().describe('Hex color for gradient start, should match the mood'),
  secondaryColor: z.string().describe('Hex color for gradient end, should complement primary'),
  accentColor: z.string().describe('Hex accent color for highlights'),
  backgroundColor: z.string().describe('Hex background color for the card'),
});

type ColorPalette = z.infer<typeof colorPaletteSchema>;

// Generate the next ticket number
async function generateTicketNumber(): Promise<string> {
  const lastTicket = await prisma.guestbookTicket.findFirst({
    orderBy: { ticketNumber: 'desc' },
    select: { ticketNumber: true },
  });

  let nextNumber = 1;
  if (lastTicket) {
    const lastNumber = Number.parseInt(lastTicket.ticketNumber.split('-')[1], 10);
    nextNumber = lastNumber + 1;
  }

  return `C-${nextNumber.toString().padStart(6, '0')}`;
}

// Generate color palette using AI
export async function generateColorPalette(mood: string): Promise<ColorPalette> {
  try {
    const { object } = await generateObject({
      model: openai('o4-mini'),
      schema: colorPaletteSchema,
      prompt: `Generate a color palette based on this mood/style description: "${mood}". 
      
      The colors should be:
      - Visually appealing and harmonious
      - Suitable for a gradient effect
      - Reflect the emotional tone or aesthetic described
      - Work well in a dark mode interface
      - Have a high contrast between the primary and secondary colors
      
      Return hex color values.`,
    });

    return object;
  } catch (_error) {
    // Fallback colors
    return {
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      accentColor: '#a78bfa',
      backgroundColor: '#1f1f23',
    };
  }
}

// Create a guestbook entry with ticket
export async function createGuestbookEntry(mood: string, message?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Generate color palette
  const colors = await generateColorPalette(mood);

  // Generate ticket number
  const ticketNumber = await generateTicketNumber();

  // Get user metadata
  const userMetadata = user.user_metadata || {};
  const userName = userMetadata.full_name || userMetadata.name || user.email?.split('@')[0] || 'Anonymous';
  const userAvatar = userMetadata.avatar_url || userMetadata.picture || null;
  const userProvider = user.app_metadata?.provider || 'email';

  // Create entry and ticket in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create guestbook entry
    const entry = await tx.guestbookEntry.create({
      data: {
        userId: user.id,
        mood,
        message,
      },
    });

    // Create ticket
    const ticket = await tx.guestbookTicket.create({
      data: {
        ticketNumber,
        entryId: entry.id,
        userId: user.id,
        userName,
        userEmail: user.email || '',
        userAvatar,
        userProvider,
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        accentColor: colors.accentColor,
        backgroundColor: colors.backgroundColor,
      },
    });

    return { entry, ticket };
  });

  // Broadcast the new ticket creation
  await broadcastGuestbookUpdate({
    type: 'ticket_created',
    ticket: {
      id: result.ticket.id,
      ticketNumber: result.ticket.ticketNumber,
      userName: result.ticket.userName,
      userEmail: result.ticket.userEmail,
      userAvatar: result.ticket.userAvatar,
      userProvider: result.ticket.userProvider,
      primaryColor: result.ticket.primaryColor,
      secondaryColor: result.ticket.secondaryColor,
      accentColor: result.ticket.accentColor,
      backgroundColor: result.ticket.backgroundColor,
      createdAt: result.ticket.createdAt.toISOString(),
    },
    timestamp: new Date().toISOString(),
  });

  return result;
}

// Get user's ticket if exists
export async function getUserTicket() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const ticket = await prisma.guestbookTicket.findFirst({
    where: { userId: user.id },
    include: { entry: true },
  });

  return ticket;
}

// Get all tickets for display
export async function getAllTickets() {
  const tickets = await prisma.guestbookTicket.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      entry: {
        select: {
          message: true,
          mood: true,
        },
      },
    },
    take: 50, // Limit to latest 50 tickets
  });

  return tickets;
}

// Update an existing guestbook entry with new message
export async function updateGuestbookEntry(
  mood: string,
  message?: string
): Promise<{
  entry: GuestbookEntry;
  ticket: GuestbookTicket;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Find existing entry
  const existingEntry = await prisma.guestbookEntry.findFirst({
    where: { userId: user.id },
    include: { ticket: true },
  });

  if (!existingEntry) {
    throw new Error('No existing ticket found');
  }

  // Generate new color palette based on new mood
  const colors = await generateColorPalette(mood);

  // Update entry and ticket
  const result = await prisma.$transaction(async (tx) => {
    // Update guestbook entry
    const entry = await tx.guestbookEntry.update({
      where: { id: existingEntry.id },
      data: {
        mood,
        message,
      },
    });

    // Update ticket colors
    const ticket = await tx.guestbookTicket.update({
      where: { entryId: entry.id },
      data: {
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        accentColor: colors.accentColor,
        backgroundColor: colors.backgroundColor,
      },
    });

    return { entry, ticket };
  });

  // Broadcast the ticket update
  await broadcastGuestbookUpdate({
    type: 'ticket_updated',
    ticket: {
      id: result.ticket.id,
      ticketNumber: result.ticket.ticketNumber,
      userName: result.ticket.userName,
      userEmail: result.ticket.userEmail,
      userAvatar: result.ticket.userAvatar,
      userProvider: result.ticket.userProvider,
      primaryColor: result.ticket.primaryColor,
      secondaryColor: result.ticket.secondaryColor,
      accentColor: result.ticket.accentColor,
      backgroundColor: result.ticket.backgroundColor,
      createdAt: result.ticket.createdAt.toISOString(),
    },
    timestamp: new Date().toISOString(),
  });

  return result;
}

// Get a specific ticket by ID
export async function getTicketById(ticketId: string) {
  const ticket = await prisma.guestbookTicket.findUnique({
    where: { id: ticketId },
    include: {
      entry: {
        select: {
          message: true,
          mood: true,
        },
      },
    },
  });

  return ticket;
}
