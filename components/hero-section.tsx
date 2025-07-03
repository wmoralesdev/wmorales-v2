'use client';

import { motion, type Variants } from 'framer-motion';
import { ChevronDown, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1, boxShadow: '0 10px 25px rgba(168, 85, 247, 0.25)' },
  hover: {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: { scale: 0.95 },
};

const sparkleVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'linear',
    },
  },
};

const particleVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

const orbVariants: Variants = {
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

export function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6 lg:px-8">
      {/* Animated Background Grid */}
      <motion.div
        animate={{ opacity: 0.3 }}
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 10%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)',
            ],
          }}
          className="absolute inset-0"
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-60">
        {/* Large floating particles */}
        <motion.div
          animate="animate"
          className="absolute top-20 left-10 h-3 w-3 rounded-full bg-gradient-to-r from-white to-purple-400"
          variants={particleVariants}
        />
        <motion.div
          animate="animate"
          className="absolute top-32 right-20 h-2 w-2 rounded-full bg-gradient-to-r from-purple-300 to-white"
          transition={{ delay: 1 }}
          variants={particleVariants}
        />
        <motion.div
          animate="animate"
          className="absolute bottom-40 left-20 h-4 w-4 rounded-full bg-gradient-to-r from-white to-purple-500"
          transition={{ delay: 2 }}
          variants={particleVariants}
        />
        <motion.div
          animate="animate"
          className="absolute top-1/3 right-1/3 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-white"
          transition={{ delay: 0.5 }}
          variants={particleVariants}
        />
        <motion.div
          animate="animate"
          className="absolute bottom-1/3 left-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-white to-purple-300"
          transition={{ delay: 1.5 }}
          variants={particleVariants}
        />
        <motion.div
          animate="animate"
          className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-white"
          transition={{ delay: 0.7 }}
          variants={particleVariants}
        />

        {/* Additional scattered particles */}
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          className="absolute top-40 right-40 h-1 w-1 rounded-full bg-purple-400"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          className="absolute right-32 bottom-32 h-1 w-1 rounded-full bg-white"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        {/* Geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          className="absolute top-28 right-60 h-6 w-6 border border-purple-400/30"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          className="absolute bottom-48 left-32 h-8 w-8 border border-white/20"
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Large Gradient Orbs */}
      <motion.div
        animate="animate"
        className="-left-20 absolute top-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/10 to-white/5 blur-3xl"
        variants={orbVariants}
      />
      <motion.div
        animate="animate"
        className="-right-20 absolute bottom-20 h-80 w-80 rounded-full bg-gradient-to-l from-white/10 to-purple-500/10 blur-3xl"
        transition={{ delay: 2 }}
        variants={orbVariants}
      />
      <motion.div
        animate="animate"
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] transform rounded-full bg-gradient-to-r from-purple-400/5 to-white/5 blur-3xl"
        transition={{ delay: 1 }}
        variants={orbVariants}
      />

      <motion.div
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl space-y-8 text-center"
        initial="hidden"
        variants={containerVariants}
      >
        <div className="space-y-4">
          <motion.h1
            className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            variants={titleVariants}
          >
            Hi, I'm{' '}
            <span className="relative inline-block">
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                className="bg-300% bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-transparent"
                style={{ backgroundSize: '300% 300%' }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                Walter Morales
              </motion.span>
            </span>
          </motion.h1>
          <motion.div className="flex items-center justify-center gap-2" variants={itemVariants}>
            <motion.div animate="animate" variants={sparkleVariants}>
              <Sparkle className="h-5 w-5 text-purple-400" />
            </motion.div>
            <p className="text-muted-foreground text-xl sm:text-2xl md:text-3xl">
              Let&apos;s{' '}
              <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text font-semibold text-transparent">
                build
              </span>{' '}
              something{' '}
              <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text font-semibold text-transparent">
                amazing
              </span>
            </p>
            <motion.div animate="animate" variants={sparkleVariants}>
              <Sparkle className="h-5 w-5 text-purple-400" />
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed sm:text-xl md:text-2xl"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text font-medium text-transparent">
            Software Engineer crafting impactful digital solutions.
          </span>
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row"
          variants={itemVariants}
        >
          <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              className="rounded-full bg-gradient-to-r from-white to-purple-500 px-8 py-6 text-base text-black transition-all duration-300 hover:from-purple-100 hover:to-purple-600"
              onClick={scrollToAbout}
              size="lg"
            >
              Get to know me
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="-translate-x-1/2 absolute bottom-8 left-1/2 transform"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="h-6 w-6 text-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
