/** biome-ignore-all lint/suspicious/noConsole: seeding process */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedEvents() {
  // Create a single event with localized content
  const event = await prisma.event.create({
    data: {
      slug: "hackathon-sv-01",
      isActive: true,
      maxImages: 50,
      endsAt: new Date("2025-10-31T23:59:59.999Z"), // October 31st, 2025
      content: {
        create: [
          {
            language: "en",
            title: "Hackathon SV - 01",
            description:
              "Welcome to the first Hackathon in El Salvador! Capture and share your innovative projects and team moments.",
          },
          {
            language: "es",
            title: "Hackathon SV - 01",
            description:
              "¡Bienvenido al primer Hackathon en El Salvador! Captura y comparte tus proyectos innovadores y momentos con tu equipo.",
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
    console.log("Localized content:");

    for (const content of event.content) {
      console.log(`- ${content.language}: ${content.title}`);
    }

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding events:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
