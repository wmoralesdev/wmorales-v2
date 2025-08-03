/** biome-ignore-all lint/suspicious/noConsole: seeding process */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  // Create a single event with localized content
  const event = await prisma.event.create({
    data: {
      slug: 'cursor-meetup-01',
      isActive: true,
      maxImages: 20,
      endsAt: new Date('2025-08-13T23:59:59.999Z'), // August 13th, 2025
      content: {
        create: [
          {
            language: 'en',
            title: 'Cursor Meetup - 01',
            description:
              'Welcome to the first Cursor meetup in El Salvador. Capture and share your moments from the event!',
          },
          {
            language: 'es',
            title: 'Cursor Meetup - 01',
            description:
              '¡Bienvenido al primer meetup de Cursor en El Salvador. ¡Comparte tus momentos con la comunidad!',
          },
        ],
      },
    },
    include: {
      content: true,
    },
  });

  return event;
}

// Run the seed
seedEvents()
  .then(async (event) => {
    // Log event details
    console.log(`Created event: ${event.slug}`);
    console.log(`QR Code: ${event.qrCode}`);
    console.log('Localized content:');

    for (const content of event.content) {
      console.log(`- ${content.language}: ${content.title}`);
    }

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding events:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
