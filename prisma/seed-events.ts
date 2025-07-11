import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  // Create sample events with different states and configurations
  const events = await Promise.all([
    // Active conference event
    prisma.event.create({
      data: {
        title: 'Next.js Conf 2024',
        description: 'Share your conference moments and connect with fellow developers!',
        isActive: true,
        maxImages: 20,
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        images: {
          create: [
            {
              userId: 'user-123',
              imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
              caption: 'Amazing opening keynote! 🚀',
            },
            {
              userId: 'user-456',
              imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
              caption: 'Great networking session',
            },
            {
              userId: 'user-789',
              imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
              caption: 'Learning about the new App Router',
            },
          ],
        },
      },
    }),

    // Team building event
    prisma.event.create({
      data: {
        title: 'Summer Team Retreat 2024',
        description: 'Capture memories from our annual team retreat!',
        isActive: true,
        maxImages: 15,
        endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        images: {
          create: [
            {
              userId: 'user-101',
              imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
              caption: 'Team lunch by the beach 🏖️',
            },
            {
              userId: 'user-102',
              imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
              caption: 'Brainstorming session',
            },
          ],
        },
      },
    }),

    // Hackathon event
    prisma.event.create({
      data: {
        title: 'AI Hackathon Weekend',
        description: 'Document your hackathon journey - from ideation to demo!',
        isActive: true,
        maxImages: 25,
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        images: {
          create: [
            {
              userId: 'user-201',
              imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
              caption: '48 hours of coding begins! 💻',
            },
            {
              userId: 'user-202',
              imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
              caption: 'Midnight coding session',
            },
            {
              userId: 'user-203',
              imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
              caption: 'Our AI project is taking shape!',
            },
            {
              userId: 'user-201',
              imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
              caption: 'Demo time! Fingers crossed 🤞',
            },
          ],
        },
      },
    }),

    // Workshop event
    prisma.event.create({
      data: {
        title: 'React Workshop Series',
        description: 'Share your learning moments from our React workshop',
        isActive: true,
        maxImages: 10,
        images: {
          create: [
            {
              userId: 'user-301',
              imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
              caption: 'Learning React hooks',
            },
            {
              userId: 'user-302',
              imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
              caption: 'Building our first component',
            },
          ],
        },
      },
    }),

    // Completed event (no longer active)
    prisma.event.create({
      data: {
        title: 'Year-End Celebration 2023',
        description: 'Thank you for making 2023 amazing!',
        isActive: false,
        maxImages: 30,
        endsAt: new Date('2023-12-31T23:59:59Z'),
        images: {
          create: [
            {
              userId: 'user-401',
              imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
              caption: 'Happy New Year! 🎉',
              createdAt: new Date('2023-12-31T22:00:00Z'),
            },
            {
              userId: 'user-402',
              imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9',
              caption: 'What a year it has been!',
              createdAt: new Date('2023-12-31T22:30:00Z'),
            },
            {
              userId: 'user-403',
              imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
              caption: 'Dancing into 2024',
              createdAt: new Date('2023-12-31T23:00:00Z'),
            },
          ],
        },
      },
    }),

    // Event with no images yet
    prisma.event.create({
      data: {
        title: 'Upcoming Product Launch',
        description: 'Get ready to share the excitement of our new product launch!',
        isActive: true,
        maxImages: 50,
        endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
    }),
  ]);

  return events;
}

// Run the seed
seedEvents()
  .then(async (events) => {
    // Log some statistics
    const stats = await Promise.all(
      events.map(async (event) => {
        const imageCount = await prisma.eventImage.count({
          where: { eventId: event.id },
        });
        return { title: event.title, imageCount, qrCode: event.qrCode };
      })
    );
    for (const stat of stats) {
      // biome-ignore lint/suspicious/noConsole: for local development
      console.log(`- ${stat.title}: ${stat.imageCount} images, QR Code: ${stat.qrCode}`);
    }

    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });