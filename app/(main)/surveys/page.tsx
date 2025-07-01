'use client';

import { motion } from 'framer-motion';
import { BarChart, ChevronLeft, FileQuestion, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SurveysPage() {
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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  const features = [
    {
      icon: FileQuestion,
      title: 'Quick Surveys',
      description: 'Participate in short, engaging surveys about tech and development',
    },
    {
      icon: BarChart,
      title: 'Live Results',
      description: 'See real-time results and insights from the community',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Topics suggested and voted on by the developer community',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className='-z-10 fixed inset-0'>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />
        <motion.div
          animate="animate"
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-10 blur-3xl"
          variants={floatVariants}
        />
        <motion.div
          animate="animate"
          className='absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-pink-500 opacity-10 blur-3xl'
          transition={{ delay: 2 }}
          variants={floatVariants}
        />
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div animate="visible" className='mx-auto max-w-4xl' initial="hidden" variants={containerVariants}>
          {/* Back Link */}
          <motion.div className="mb-8" variants={itemVariants}>
            <Link
              className='inline-flex items-center text-muted-foreground transition-colors hover:text-foreground'
              href="/"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div className='mb-12 text-center' variants={itemVariants}>
            <motion.h1
              className='mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text font-bold text-4xl text-transparent md:text-5xl'
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              Developer Surveys
            </motion.h1>
            <p className="text-lg text-muted-foreground">Quick polls and surveys for the developer community</p>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-purple-900/20 bg-gradient-to-br from-purple-900/5 via-background to-pink-900/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Coming Soon!</CardTitle>
                <CardDescription className="text-lg">
                  We're building an interactive survey platform just for developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-8 grid gap-6 md:grid-cols-3'>
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      transition={{ duration: 0.2 }}
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className='space-y-2 p-4 text-center'>
                        <motion.div
                          className='inline-block rounded-full bg-purple-500/10 p-3'
                          transition={{ duration: 0.6 }}
                          whileHover={{ rotate: 360 }}
                        >
                          <feature.icon className="h-6 w-6 text-purple-400" />
                        </motion.div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className='text-muted-foreground text-sm'>{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center"
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled
                    size="lg"
                  >
                    Launching Soon
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
