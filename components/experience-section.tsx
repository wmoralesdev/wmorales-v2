'use client';

import { motion, type Variants } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Animation variants with correct TypeScript types
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    x: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.01,
    x: 8,
    boxShadow: '0 8px 25px rgba(168, 85, 247, 0.12)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: 15,
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const badgeVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    rotate: 1,
    transition: {
      duration: 0.2,
      type: 'spring' as const,
      stiffness: 300,
    },
  },
};

export function ExperienceSection() {
  const experiences = [
    {
      company: 'Southworks',
      role: 'Sr Software Engineer',
      period: 'Apr 2023 – Now',
      achievements: ['Developed cloud-based solutions using .NET & NodeJS + ReactJS', 'Mentored junior engineers'],
      current: true,
    },
    {
      company: 'Freelance',
      role: 'Product Engineer',
      period: 'Apr 2023 – Jan 2024',
      achievements: [
        'Architected and led development of a government web service application',
        'Delivered project on time and within budget',
      ],
    },
    {
      company: 'Ravn',
      role: 'Sr Software Engineer',
      period: 'Jan 2023 – Mar 2023',
      achievements: ['API migration to .NET environment', 'Provided technical consultancy'],
    },
    {
      company: 'Resultier',
      role: '.NET Developer',
      period: 'Apr 2022 – Dec 2022',
      achievements: [
        'Built medical software for patient vital sign analysis',
        'Collaborated with cross-functional teams',
      ],
    },
    {
      company: 'InnRoad',
      role: 'Software Engineer',
      period: 'Apr 2021 – Apr 2022',
      achievements: [
        'Developed microservices for Airbnb and Hotel Booking integrations',
        'Enhanced system reliability and uptime',
      ],
    },
    {
      company: 'Elaniin',
      role: 'JavaScript Fullstack Developer',
      period: 'Nov 2020 – Jan 2022',
      achievements: ['Developed enterprise software in JavaScript and .NET', 'Led migration to cloud infrastructure'],
    },
    {
      company: 'VincuHub',
      role: 'Fullstack Developer',
      period: 'Jan 2020 – Nov 2020',
      achievements: [
        'Created and managed .NET applications and ReactJS websites',
        'Improved deployment pipeline, reducing release time by 30%',
      ],
    },
  ];

  return (
    <section className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="mb-8 text-center"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.h2 className="mb-3 font-bold text-3xl sm:text-4xl md:text-5xl" variants={headerVariants}>
            Work Experience
          </motion.h2>
          <motion.p className="text-base text-muted-foreground sm:text-lg" variants={headerVariants}>
            My professional journey building impactful solutions
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.1 }}
          whileInView="visible"
        >
          {/* Main timeline line */}
          <motion.div
            className="absolute top-8 bottom-8 left-4 w-0.5 bg-gradient-to-b from-purple-400 via-purple-300 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            whileInView={{ scaleY: 1 }}
          />

          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <motion.div
                className="relative"
                initial="rest"
                key={exp.company.concat(exp.role)}
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute top-4 left-3 z-10 h-2 w-2 rounded-full border-2 border-background bg-purple-400"
                  initial={{ scale: 0 }}
                  transition={{
                    delay: index * 0.08 + 0.3,
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 300,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.5, backgroundColor: '#a855f7' }}
                  whileInView={{ scale: 1 }}
                />

                <motion.div className="ml-8" variants={cardHoverVariants}>
                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <motion.div
                            className="mb-1 flex flex-wrap items-center gap-2"
                            initial="rest"
                            whileHover="hover"
                          >
                            <motion.div variants={iconVariants}>
                              <Briefcase className="h-4 w-4 flex-shrink-0 text-primary" />
                            </motion.div>
                            <motion.h3
                              className="truncate font-semibold text-lg"
                              transition={{ duration: 0.2 }}
                              whileHover={{ x: 3 }}
                            >
                              {exp.company}
                            </motion.h3>
                            {exp.current && (
                              <motion.div initial="rest" variants={badgeVariants} whileHover="hover">
                                <Badge
                                  className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-xs"
                                  variant="default"
                                >
                                  Current
                                </Badge>
                              </motion.div>
                            )}
                          </motion.div>

                          <motion.p
                            className="mb-2 font-medium text-primary text-sm"
                            initial={{ opacity: 0 }}
                            transition={{
                              delay: index * 0.08 + 0.4,
                              duration: 0.4,
                            }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1 }}
                          >
                            {exp.role}
                          </motion.p>

                          <motion.ul className="space-y-1">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <motion.li
                                className="flex items-start gap-2 text-xs sm:text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                key={achievement}
                                transition={{
                                  delay: index * 0.08 + achievementIndex * 0.05 + 0.5,
                                  duration: 0.3,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ x: 2 }}
                                whileInView={{ opacity: 1, x: 0 }}
                              >
                                <motion.div
                                  className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary"
                                  whileHover={{ scale: 1.5 }}
                                />
                                <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>

                        <motion.div
                          className="flex flex-shrink-0 items-center gap-1.5 text-muted-foreground"
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.div transition={{ duration: 0.6 }} whileHover={{ rotate: 360 }}>
                            <Calendar className="h-3.5 w-3.5" />
                          </motion.div>
                          <span className="whitespace-nowrap text-xs sm:text-sm">{exp.period}</span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
