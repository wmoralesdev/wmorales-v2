'use client';

import { motion } from 'framer-motion';
import { Code, Globe, GraduationCap, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutSection() {
  const skills = [
    '.NET',
    'JavaScript',
    'TypeScript',
    'ReactJS',
    'NextJS',
    'NestJS',
    'PostgreSQL',
    'MongoDB',
    'SQL Server',
    'Tailwind CSS',
    'Docker',
    'AWS',
    'Azure',
    'ShadCN',
    'Supabase',
    'Firebase',
    'Vercel',
    'Vercel AI SDK',
    'Cursor',
    'Expo',
  ];

  const stats = [
    { icon: Code, label: 'Years of experience', value: '5+' },
    { icon: Globe, label: 'Countries', value: '10+' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const skillBadgeVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.95,
      rotate: -2,
    },
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.h2 className="mb-4 font-bold text-3xl sm:text-4xl md:text-5xl" variants={itemVariants}>
            Software Engineer | Cursor Ambassador
          </motion.h2>
          <motion.p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl" variants={itemVariants}>
            Experienced Software Engineer with a focus on .NET, JavaScript, and cloud technologies. I love building
            scalable products and collaborating with global teams.
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          {/* Stats */}
          <div className="space-y-6 lg:col-span-1">
            {stats.map((stat, index) => (
              <motion.div initial="rest" key={stat.label} variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="cursor-pointer text-center">
                    <CardContent className="p-6">
                      <motion.div variants={iconVariants}>
                        <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                      </motion.div>
                      <motion.div
                        className="mb-1 font-bold text-2xl text-primary sm:text-3xl"
                        initial={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          duration: 0.5,
                          type: 'spring',
                        }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, scale: 1 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-muted-foreground text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <motion.div initial="rest" variants={cardHoverVariants} whileHover="hover">
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div transition={{ duration: 0.6 }} whileHover={{ rotate: 360 }}>
                      <Code className="h-5 w-5" />
                    </motion.div>
                    Main Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial="hidden"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                    viewport={{ once: true }}
                    whileInView="visible"
                  >
                    {skills.map((skill, _index) => (
                      <motion.div
                        initial="rest"
                        key={skill}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8, y: 20 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              duration: 0.4,
                              ease: 'easeOut',
                            },
                          },
                        }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <motion.div variants={skillBadgeVariants}>
                          <Badge
                            className="cursor-pointer bg-muted px-3 py-1 text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
                            variant="secondary"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          {/* Currently Learning */}
          <motion.div variants={itemVariants}>
            <motion.div initial="rest" variants={cardHoverVariants} whileHover="hover">
              <Card className="h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div transition={{ duration: 0.3 }} whileHover={{ rotate: 15, scale: 1.2 }}>
                      <GraduationCap className="h-5 w-5" />
                    </motion.div>
                    Currently Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1 }}
                  >
                    LLMs, AI, and Web3 technologies to stay at the forefront of innovation.
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div variants={itemVariants}>
            <motion.div initial="rest" variants={cardHoverVariants} whileHover="hover">
              <Card className="h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 5,
                      }}
                      whileHover={{ scale: 1.3 }}
                    >
                      <Heart className="h-5 w-5 text-red-400" />
                    </motion.div>
                    Fun Fact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1 }}
                  >
                    I'm a big fan of Japanese culture!{' '}
                    <motion.span
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                      }}
                      className="inline-block"
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      🇯🇵
                    </motion.span>
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
