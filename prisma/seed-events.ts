import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding events...');

  // Create sample events
  const events = [
    {
      title: 'Cursor Meetup 2024',
      description: 'Join us for an amazing evening of coding, networking, and fun!',
      qrCode: 'cursor2024',
      maxImages: 15,
      endsAt: new Date('2024-12-31T23:59:59Z'),
    },
    {
      title: 'Developer Workshop',
      description: 'Hands-on workshop for developers to learn new technologies',
      qrCode: 'workshop2024',
      maxImages: 10,
      endsAt: new Date('2024-11-30T23:59:59Z'),
    },
    {
      title: 'Tech Conference',
      description: 'Annual technology conference with speakers from around the world',
      qrCode: 'techconf2024',
      maxImages: 20,
      endsAt: new Date('2024-10-31T23:59:59Z'),
    },
  ];

  for (const eventData of events) {
    const event = await prisma.event.upsert({
      where: { qrCode: eventData.qrCode },
      update: {},
      create: eventData,
    });

    console.log(`✅ Created event: ${event.title} (QR: ${event.qrCode})`);
  }

  console.log('🎉 Events seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding events:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });