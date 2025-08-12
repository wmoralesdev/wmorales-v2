import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPoll() {
  // Poll 1: Uso de herramientas de IA
  const pollAI = await prisma.poll.create({
    data: {
      title: 'Uso de herramientas de inteligencia artificial',
      description:
        'Queremos conocer tu experiencia con herramientas de IA y asistentes de programación',
      language: 'es',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: '¿Has utilizado algún tipo de herramienta de IA, asistente o similar?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Sí, he utilizado herramientas de IA',
                  value: 'yes',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'No, nunca he utilizado herramientas de IA',
                  value: 'no',
                  color: 'bg-red-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'No estoy seguro',
                  value: 'not-sure',
                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 2,
            question: '¿Utilizas en tu día a día alguna herramienta de IA para programación (Cursor, Windsurf, Claude, etc.)?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Sí, uso herramientas de IA para programar diariamente',
                  value: 'daily',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'Las uso ocasionalmente',
                  value: 'occasionally',
                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Las he probado pero no las uso regularmente',
                  value: 'tried',
                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: 'No uso herramientas de IA para programar',
                  value: 'no',
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

  // Poll 2: Perfil técnico
  const pollTechnical = await prisma.poll.create({
    data: {
      title: 'Perfil profesional',
      description:
        'Ayúdanos a conocer mejor el perfil de nuestros asistentes',
      language: 'es',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: '¿Te consideras una persona técnica o no técnica en términos de conocimientos de programación?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Técnica - tengo conocimientos de programación',
                  value: 'technical',
                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'No técnica - no tengo conocimientos de programación',
                  value: 'non-technical',
                  color: 'bg-purple-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'En proceso de aprendizaje',
                  value: 'learning',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Poll 3: Retroalimentación del evento
  const pollFeedback = await prisma.poll.create({
    data: {
      title: 'Retroalimentación del evento',
      description:
        'Tu opinión es importante para mejorar futuros eventos',
      language: 'es',
      showResults: true,
      allowMultiple: false,
      resultsDelay: 0,
      questions: {
        create: [
          {
            questionOrder: 1,
            question: 'Del 1 al 10, ¿qué tan satisfecho estás con el evento actual?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: '1 - Muy insatisfecho',
                  value: '1',
                  color: 'bg-red-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: '2',
                  value: '2',
                  color: 'bg-red-400/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: '3',
                  value: '3',
                  color: 'bg-orange-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: '4',
                  value: '4',
                  color: 'bg-orange-400/20',
                  language: 'es',
                },
                {
                  optionOrder: 5,
                  label: '5 - Neutral',
                  value: '5',
                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 6,
                  label: '6',
                  value: '6',
                  color: 'bg-yellow-400/20',
                  language: 'es',
                },
                {
                  optionOrder: 7,
                  label: '7',
                  value: '7',
                  color: 'bg-lime-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 8,
                  label: '8',
                  value: '8',
                  color: 'bg-green-400/20',
                  language: 'es',
                },
                {
                  optionOrder: 9,
                  label: '9',
                  value: '9',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 10,
                  label: '10 - Muy satisfecho',
                  value: '10',
                  color: 'bg-green-600/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 2,
            question: '¿Qué tipo de evento te gustaría para la próxima ocasión?',
            type: 'multiple',
            maxSelections: 2,
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Hackatón',
                  value: 'hackathon',
                  color: 'bg-purple-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'Meetup',
                  value: 'meetup',
                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Taller práctico',
                  value: 'workshop',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 4,
                  label: 'After office',
                  value: 'after-office',
                  color: 'bg-orange-500/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 3,
            question: '¿Te interesaría participar como organizador o ponente en futuros eventos?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Sí, me encantaría colaborar en la organización o dar una charla',
                  value: 'yes',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'No por el momento, prefiero solo asistir',
                  value: 'no',
                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'Tal vez en el futuro',
                  value: 'maybe',
                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
              ],
            },
          },
          {
            questionOrder: 4,
            question: '¿Perteneces a alguna organización que podría estar interesada en participar en este tipo de eventos?',
            type: 'single',
            language: 'es',
            options: {
              create: [
                {
                  optionOrder: 1,
                  label: 'Sí, mi organización podría estar interesada',
                  value: 'yes',
                  color: 'bg-green-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 2,
                  label: 'No, asisto de manera personal',
                  value: 'no',
                  color: 'bg-blue-500/20',
                  language: 'es',
                },
                {
                  optionOrder: 3,
                  label: 'No estoy seguro, pero podría consultarlo',
                  value: 'maybe',
                  color: 'bg-yellow-500/20',
                  language: 'es',
                },
              ],
            },
          },
        ],
      },
    },
  });

  return { pollAI, pollTechnical, pollFeedback };
}

// Run the seed
seedPoll()
  .then(async (polls) => {
    console.log('✅ Encuestas creadas exitosamente:');
    console.log(`   - Uso de IA: ${polls.pollAI.code}`);
    console.log(`   - Perfil técnico: ${polls.pollTechnical.code}`);
    console.log(`   - Retroalimentación: ${polls.pollFeedback.code}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Error al crear las encuestas:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
