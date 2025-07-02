import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPoll() {
  // Create a sample poll
  const poll = await prisma.poll.create({
    data: {
      title: 'What should we build next?',
      description: 'Help us decide our next feature by voting on your favorite option!',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: 'Which feature would you like to see next?',
            type: 'single',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'AI-powered code review',
                  value: 'ai-code-review',
                  emoji: '🤖',
                  color: 'bg-blue-500/20',
                },
                {
                  optionOrder: 2,
                  label: 'Real-time collaboration',
                  value: 'realtime-collab',
                  emoji: '👥',
                  color: 'bg-green-500/20',
                },
                {
                  optionOrder: 3,
                  label: 'Advanced analytics dashboard',
                  value: 'analytics',
                  emoji: '📊',
                  color: 'bg-purple-500/20',
                },
                {
                  optionOrder: 4,
                  label: 'Mobile app',
                  value: 'mobile-app',
                  emoji: '📱',
                  color: 'bg-orange-500/20',
                },
              ],
            },
          },
          {
            questionOrder: 2,
            question: 'What technologies are you interested in?',
            type: 'multiple',
            maxSelections: 3,
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'React/Next.js',
                  value: 'react-nextjs',
                  emoji: '⚛️',
                },
                {
                  optionOrder: 2,
                  label: 'TypeScript',
                  value: 'typescript',
                  emoji: '📘',
                },
                {
                  optionOrder: 3,
                  label: 'GraphQL',
                  value: 'graphql',
                  emoji: '🔷',
                },
                {
                  optionOrder: 4,
                  label: 'Machine Learning',
                  value: 'ml',
                  emoji: '🧠',
                },
                {
                  optionOrder: 5,
                  label: 'Blockchain',
                  value: 'blockchain',
                  emoji: '🔗',
                },
                {
                  optionOrder: 6,
                  label: 'Cloud/DevOps',
                  value: 'cloud-devops',
                  emoji: '☁️',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created poll with code: ${poll.code}`);
  console.log(`View poll at: http://localhost:3000/polls/${poll.code}`);

  return poll;
}

// Run the seed
seedPoll()
  .then(async (poll) => {
    console.log('Poll seeded successfully!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding poll:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
