import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPoll() {
  // Create English poll for event feedback
  const pollEn = await prisma.poll.create({
    data: {
      title: 'Event Feedback Survey',
      description:
        'Help us improve future events by sharing your experience and preferences!',
      language: 'en',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: "How satisfied were you with today's event?",
            type: 'single',
            language: 'en',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Very satisfied',
                  value: 'very-satisfied',

                  color: 'bg-green-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 2,
                  label: 'Satisfied',
                  value: 'satisfied',

                  color: 'bg-blue-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 3,
                  label: 'Neutral',
                  value: 'neutral',

                  color: 'bg-yellow-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 4,
                  label: 'Dissatisfied',
                  value: 'dissatisfied',

                  color: 'bg-orange-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 5,
                  label: 'Very dissatisfied',
                  value: 'very-dissatisfied',

                  color: 'bg-red-500/20',
                  language: 'en',
                },
              ],
            },
          },
          {
            questionOrder: 2,
            question:
              'What type of events would you like to see in the future?',
            type: 'multiple',
            maxSelections: 3,
            language: 'en',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Hackathon',
                  value: 'hackathon',

                  color: 'bg-purple-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 2,
                  label: 'Technical Workshops',
                  value: 'workshops',

                  color: 'bg-blue-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 3,
                  label: 'Networking Meetups',
                  value: 'meetups',

                  color: 'bg-green-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 4,
                  label: 'Tech Talks',
                  value: 'tech-talks',

                  color: 'bg-yellow-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 5,
                  label: 'Coding Bootcamps',
                  value: 'bootcamps',

                  color: 'bg-indigo-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 6,
                  label: 'Other',
                  value: 'other',

                  color: 'bg-gray-500/20',
                  language: 'en',
                },
              ],
            },
          },
          {
            questionOrder: 3,
            question: 'Which features would you like to see in future demos?',
            type: 'multiple',
            maxSelections: 3,
            language: 'en',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'AI/ML Integration',
                  value: 'ai-ml',

                  color: 'bg-purple-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 2,
                  label: 'Real-time Collaboration',
                  value: 'realtime',

                  color: 'bg-blue-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 3,
                  label: 'Mobile Development',
                  value: 'mobile',

                  color: 'bg-green-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 4,
                  label: 'Cloud Architecture',
                  value: 'cloud',

                  color: 'bg-sky-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 5,
                  label: 'Web3/Blockchain',
                  value: 'web3',

                  color: 'bg-orange-500/20',
                  language: 'en',
                },
                {
                  optionOrder: 6,
                  label: 'DevOps/CI-CD',
                  value: 'devops',

                  color: 'bg-red-500/20',
                  language: 'en',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create Spanish poll for event feedback
  const pollEs = await prisma.poll.create({
    data: {
      title: 'Encuesta de Retroalimentación del Evento',
      description:
        '¡Ayúdanos a mejorar futuros eventos compartiendo tu experiencia y preferencias!',
      language: 'es',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: '¿Qué tan satisfecho estás con el evento de hoy?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Muy satisfecho',
                  value: 'very-satisfied',

                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'Satisfecho',
                  value: 'satisfied',

                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Neutral',
                  value: 'neutral',

                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: 'Insatisfecho',
                  value: 'dissatisfied',

                  color: 'bg-orange-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 5,
                  label: 'Muy insatisfecho',
                  value: 'very-dissatisfied',

                  color: 'bg-red-500/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 2,
            question: '¿Qué tipo de eventos te gustaría ver en el futuro?',
            type: 'multiple',
            maxSelections: 3,
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Hackathon',
                  value: 'hackathon',

                  color: 'bg-purple-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'Talleres Técnicos',
                  value: 'workshops',

                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Reuniones de Networking',
                  value: 'meetups',

                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: 'Charlas Técnicas',
                  value: 'tech-talks',

                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 5,
                  label: 'Bootcamps de Programación',
                  value: 'bootcamps',

                  color: 'bg-indigo-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 6,
                  label: 'Otro',
                  value: 'other',

                  color: 'bg-gray-500/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 3,
            question: '¿Qué características te gustaría ver en futuras demos?',
            type: 'multiple',
            maxSelections: 3,
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Integración IA/ML',
                  value: 'ai-ml',

                  color: 'bg-purple-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'Colaboración en Tiempo Real',
                  value: 'realtime',

                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Desarrollo Móvil',
                  value: 'mobile',

                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: 'Arquitectura Cloud',
                  value: 'cloud',

                  color: 'bg-sky-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 5,
                  label: 'Web3/Blockchain',
                  value: 'web3',

                  color: 'bg-orange-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 6,
                  label: 'DevOps/CI-CD',
                  value: 'devops',

                  color: 'bg-red-500/20',
                  language: 'es',
                },
              ],
            },
          },
        ],
      },
    },
  });

  return { pollEn, pollEs };
}

// Run the seed
seedPoll()
  .then(async (polls) => {
    console.log('✅ Created event feedback polls:');
    console.log(`   - English: ${polls.pollEn.code}`);
    console.log(`   - Spanish: ${polls.pollEs.code}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Error seeding polls:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
