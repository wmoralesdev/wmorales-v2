'use client';

import { motion, type Variants } from 'framer-motion';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
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
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const dotVariants: Variants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="border-t bg-card"
      initial="hidden"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.8 }}
      whileInView="visible"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <motion.div className="mb-4 flex items-center justify-center gap-2" variants={itemVariants}>
            <motion.div
              animate="animate"
              className="h-2 w-2 rounded-full bg-purple-400"
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              variants={dotVariants}
            />
            <motion.p
              className="font-medium text-muted-foreground"
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              Built with{' '}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                className="inline-block"
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 5,
                }}
              >
                💜
              </motion.span>{' '}
              using Next.js & Tailwind CSS
            </motion.p>
            <motion.div
              animate="animate"
              className="h-2 w-2 rounded-full bg-purple-400"
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              variants={dotVariants}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            transition={{ delay: 0.2 }}
            variants={itemVariants}
            viewport={{ once: true }}
            whileInView="visible"
          >
            <motion.p className="text-muted-foreground text-sm" transition={{ duration: 0.2 }} whileHover={{ x: 2 }}>
              Copyright © {currentYear}{' '}
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium text-transparent"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                Walter Morales
              </motion.span>
              . All rights reserved.
            </motion.p>
          </motion.div>

          {/* Hidden Easter Egg */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.p
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              className="text-muted-foreground/50 text-xs"
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              ✨ Made with passion and lots of ☕
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
