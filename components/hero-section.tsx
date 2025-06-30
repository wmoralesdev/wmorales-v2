"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkle } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.25)" },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const sparkleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const particleVariants = {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
              `radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 10%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)`
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-60">
        {/* Large floating particles */}
        <motion.div
          className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-r from-white to-purple-400 rounded-full"
          variants={particleVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-32 right-20 w-2 h-2 bg-gradient-to-r from-purple-300 to-white rounded-full"
          variants={particleVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-4 h-4 bg-gradient-to-r from-white to-purple-500 rounded-full"
          variants={particleVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-white rounded-full"
          variants={particleVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-gradient-to-r from-white to-purple-300 rounded-full"
          variants={particleVariants}
          animate="animate"
          transition={{ delay: 1.5 }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-purple-500 to-white rounded-full"
          variants={particleVariants}
          animate="animate"
          transition={{ delay: 0.7 }}
        />

        {/* Additional scattered particles */}
        <motion.div
          className="absolute top-40 right-40 w-1 h-1 bg-purple-400 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-1 h-1 bg-white rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-28 right-60 w-6 h-6 border border-purple-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-48 left-32 w-8 h-8 border border-white/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Large Gradient Orbs */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-white/5 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-l from-white/10 to-purple-500/10 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/5 to-white/5 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />

      <motion.div
        className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            variants={titleVariants}
          >
            Hi, I'm{" "}
            <span className="relative inline-block">
              <motion.span
                className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent bg-300% font-bold"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ backgroundSize: "300% 300%" }}
              >
                Walter Morales
              </motion.span>
            </span>
          </motion.h1>
          <motion.div
            className="flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkle className="h-5 w-5 text-purple-400" />
            </motion.div>
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
              Let&apos;s{" "}
              <span className="font-semibold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">build</span>{" "}
              something{" "}
              <span className="font-semibold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">amazing</span>
            </p>
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkle className="h-5 w-5 text-purple-400" />
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-medium">
            Software Engineer crafting impactful digital solutions.
          </span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              size="lg"
              onClick={scrollToAbout}
              className="text-base px-8 py-6 rounded-full bg-gradient-to-r from-white to-purple-500 text-black hover:from-purple-100 hover:to-purple-600 transition-all duration-300"
            >
              Get to know me
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  );
} 