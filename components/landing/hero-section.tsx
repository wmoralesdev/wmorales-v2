'use client';

import { motion, type Variants } from 'framer-motion';
import { ChevronDown, Sparkle } from 'lucide-react';
import {
  CoffeeChatCard,
  CurrentlyLearningCard,
  CursorAmbassadorCard,
  ExperienceCard,
  GlobalReachCard,
  ProficiencyCard,
  TechStackCard,
  TerminalCard,
} from '@/components/landing/hero-cards';
import { Button } from '@/components/ui/button';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function HeroSection() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />

      {/* Animated mesh gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.15) 0%, transparent 50%)',
          ],
        }}
        className="absolute inset-0"
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className='grid min-h-[calc(100vh-8rem)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Left side - Text content */}
          <motion.div
            animate="visible"
            className="space-y-8 text-center lg:text-left"
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className='flex items-center justify-center gap-2 lg:justify-start'>
                <Sparkle className="h-5 w-5 text-purple-400" />
                <span className='font-medium text-purple-400 text-sm'>Available for new projects</span>
              </div>

              <h1 className='font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl'>
                <span className="text-gray-400">👋 I'm Walter, and I</span>
                <br />
                <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  innovate
                </span>
              </h1>

              <div className="space-y-4">
                <h2 className='font-semibold text-2xl sm:text-3xl lg:text-4xl'>
                  <span className="text-white">Development with</span>{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    passion
                  </span>
                  <br />
                  <span className="text-white">to create impactful</span>
                  <br />
                  <span className="text-gray-300">products.</span>
                </h2>
              </div>

              <div className='flex items-center justify-center gap-4 text-gray-400 lg:justify-start'>
                <span className="text-2xl">/</span>
                <a className='transition-colors hover:text-purple-400' href="mailto:walterrafael26@gmail.com">
                  walterrafael26@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div className="flex justify-center lg:justify-start" variants={itemVariants}>
              <Button
                className='rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25'
                onClick={scrollToContact}
                size="lg"
              >
                Let's work together
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Visual cards */}
          <motion.div
            animate="visible"
            className='relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:h-[700px]'
            initial="hidden"
            variants={containerVariants}
          >
            {/* Desktop Layout - Absolute Positioning */}
            <div className="hidden lg:block">
              <GlobalReachCard containerClassName="absolute top-0 left-0 w-48" transition={{ delay: 0 }} />

              <CursorAmbassadorCard containerClassName="absolute top-0 right-0 w-56" transition={{ delay: 0.1 }} />

              <CurrentlyLearningCard containerClassName="absolute top-36 left-12 w-52" transition={{ delay: 0.2 }} />

              <TechStackCard containerClassName="absolute bottom-24 left-0 w-64" transition={{ delay: 0.3 }} />

              <TerminalCard containerClassName="absolute bottom-24 right-0 w-72" transition={{ delay: 0.4 }} />

              <ProficiencyCard containerClassName="absolute top-44 right-8 w-60" transition={{ delay: 0.5 }} />

              <CoffeeChatCard
                containerClassName="absolute bottom-0 left-1/2 -translate-x-1/2 w-64"
                onChatClick={scrollToContact}
                transition={{ delay: 0.6 }}
              />

              <ExperienceCard containerClassName="absolute top-72 left-1/3 w-48" transition={{ delay: 0.7 }} />
            </div>

            {/* Mobile/Tablet Layout - Grid */}
            <div className='contents lg:hidden'>
              <GlobalReachCard transition={{ delay: 0 }} />
              <CursorAmbassadorCard transition={{ delay: 0.1 }} />
              <CurrentlyLearningCard transition={{ delay: 0.2 }} />
              <TechStackCard transition={{ delay: 0.3 }} />
              <TerminalCard containerClassName="sm:col-span-2" transition={{ delay: 0.4 }} />
              <ProficiencyCard containerClassName="sm:col-span-2" transition={{ delay: 0.5 }} />
              <CoffeeChatCard
                containerClassName="sm:col-span-2"
                onChatClick={scrollToContact}
                transition={{ delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Experience Badge - Mobile only now */}
        <motion.div
          animate="visible"
          className='mt-8 flex justify-center lg:hidden'
          initial="hidden"
          variants={itemVariants}
        >
          <div className='rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-purple-600/20 px-6 py-3 text-center backdrop-blur-xl'>
            <span className='font-medium text-base text-purple-300'>5+ Years Experience</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='-translate-x-1/2 absolute bottom-8 left-1/2 transform'
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="h-6 w-6 text-purple-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
