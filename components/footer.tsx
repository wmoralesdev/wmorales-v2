"use client";

import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const itemVariants = {
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

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
    },
  };

  return (
    <motion.footer
      className="border-t bg-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <motion.div
            className="flex justify-center items-center gap-2 mb-4"
            variants={itemVariants}
          >
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate="animate"
              variants={dotVariants}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.p
              className="text-muted-foreground font-medium"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Built with{" "}
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                💜
              </motion.span>
              {" "}using Next.js & Tailwind CSS
            </motion.p>
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate="animate"
              variants={dotVariants}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.p
              className="text-sm text-muted-foreground"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              Copyright © {currentYear}{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
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
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className="text-xs text-muted-foreground/50"
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
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