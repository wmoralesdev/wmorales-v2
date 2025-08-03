import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a contact info survey
  const _survey = await prisma.survey.create({
    data: {
      title: 'Contact Information Survey',
      description: 'Please share your contact details so we can get in touch.',
      status: 'active',
      sections: {
        create: [
          {
            sectionOrder: 1,
            title: 'Contact Details',
            description: 'We would love to stay in touch with you.',
            questions: {
              create: [
                {
                  questionOrder: 1,
                  question: 'What is your full name?',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter your full name',
                },
                {
                  questionOrder: 2,
                  question: 'What is your email address?',
                  type: 'text',
                  required: true,
                  placeholder: 'email@example.com',
                },
                {
                  questionOrder: 3,
                  question: 'What is your phone number?',
                  type: 'text',
                  required: false,
                  placeholder: '+1 (555) 000-0000',
                },
                {
                  questionOrder: 4,
                  question: 'What is your preferred method of contact?',
                  type: 'radio',
                  required: true,
                  options: {
                    create: [
                      {
                        optionOrder: 1,
                        label: 'Email',
                        value: 'email',
                      },
                      {
                        optionOrder: 2,
                        label: 'Phone',
                        value: 'phone',
                      },
                      {
                        optionOrder: 3,
                        label: 'Text/SMS',
                        value: 'sms',
                      },
                    ],
                  },
                },
                {
                  questionOrder: 5,
                  question: 'How did you hear about us?',
                  type: 'select',
                  required: false,
                  placeholder: 'Please select an option',
                  options: {
                    create: [
                      {
                        optionOrder: 1,
                        label: 'Search Engine',
                        value: 'search',
                      },
                      {
                        optionOrder: 2,
                        label: 'Social Media',
                        value: 'social',
                      },
                      {
                        optionOrder: 3,
                        label: 'Friend/Referral',
                        value: 'referral',
                      },
                      {
                        optionOrder: 4,
                        label: 'Other',
                        value: 'other',
                      },
                    ],
                  },
                },
                {
                  questionOrder: 6,
                  question:
                    'What topics are you interested in? (select all that apply)',
                  type: 'checkbox',
                  required: false,
                  options: {
                    create: [
                      {
                        optionOrder: 1,
                        label: 'Product Updates',
                        value: 'product-updates',
                      },
                      {
                        optionOrder: 2,
                        label: 'Industry News',
                        value: 'industry-news',
                      },
                      {
                        optionOrder: 3,
                        label: 'Events & Webinars',
                        value: 'events',
                      },
                      {
                        optionOrder: 4,
                        label: 'Educational Content',
                        value: 'education',
                      },
                    ],
                  },
                },
                {
                  questionOrder: 7,
                  question: 'Any additional comments or questions?',
                  type: 'textarea',
                  required: false,
                  placeholder: 'Tell us more...',
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (_e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
