'use client';

import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export function LoginPageContent() {
  // Animation variants from animations.md
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
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

  const badgeVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: {
        duration: 0.2,
        type: 'spring' as const,
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.95,
      rotate: -2,
    },
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  const iconRotateVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <motion.div
        animate="visible"
        className="flex flex-col gap-4 p-6 md:p-10"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex justify-center gap-2 md:justify-start" variants={itemVariants}>
          <Link className="flex items-center gap-2 font-medium" href="/">
            <motion.div
              className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
              initial="rest"
              variants={iconRotateVariants}
              whileHover="hover"
            >
              <Code2 className="size-4" />
            </motion.div>
            <motion.span
              className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
              transition={{ duration: 0.3 }}
              whileHover={{ letterSpacing: '0.05em' }}
            >
              Walter Morales
            </motion.span>
          </Link>
        </motion.div>
        <motion.div className="flex flex-1 items-center justify-center" variants={itemVariants}>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </motion.div>
      </motion.div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-600/30 to-pink-600/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/60" />
          {/* Animated gradient orbs */}
          <motion.div
            animate="animate"
            className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-20 blur-3xl"
            variants={orbVariants}
          />
          <motion.div
            animate="animate"
            className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-pink-500 opacity-20 blur-3xl"
            transition={{ delay: 2 }}
            variants={orbVariants}
          />
        </div>
        <motion.div
          animate="visible"
          className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center"
          initial="hidden"
          variants={containerVariants}
        >
          <div className="max-w-md space-y-6">
            <motion.div className="mx-auto" initial="rest" variants={itemVariants} whileHover="hover">
              <motion.div variants={iconRotateVariants}>
                <Code2 className="mx-auto h-16 w-16 text-purple-400" />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <h2 className="font-bold text-3xl text-white">Welcome to my platform</h2>
              <p className="text-lg text-purple-100">
                Join me on this journey of building amazing digital experiences with cutting-edge technologies.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-wrap justify-center gap-2 text-purple-200 text-sm"
              variants={containerVariants}
            >
              {['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind CSS'].map((tech, index) => (
                <motion.span
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.6 + index * 0.1 },
                  }}
                  className="cursor-default rounded-full border border-purple-300/30 px-3 py-1"
                  custom={index}
                  initial="rest"
                  key={tech}
                  variants={badgeVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}