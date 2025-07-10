'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  Code2,
  Github,
  Globe,
  Linkedin,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export { metadata } from './metadata';

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

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function CursorPage() {
  const expertiseAreas = [
    {
      title: 'Tab Completion Mastery',
      description: "Expert in leveraging Cursor's intelligent tab completion for rapid code generation",
      icon: Zap,
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Inline Edit Workflows',
      description: 'Advanced techniques for efficient inline editing and code transformation',
      icon: Code2,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Agentic Prompts',
      description: 'Crafting powerful prompts that make AI work smarter, not harder',
      icon: MessageCircle,
      gradient: 'from-green-500 to-teal-600',
    },
  ];

  const offerings = [
    {
      title: 'Team Training',
      description: 'Comprehensive Cursor training for development teams',
      features: ['Hands-on workshops', 'Best practices', 'Custom workflows'],
      icon: Users,
    },
    {
      title: 'Consultations',
      description: 'One-on-one sessions to accelerate your AI-powered development',
      features: ['Personalized guidance', 'Workflow optimization', 'Advanced techniques'],
      icon: Calendar,
    },
    {
      title: 'Community Access',
      description: 'Join the growing LATAM Cursor community',
      features: ['WhatsApp group', 'Resource sharing', 'Peer support'],
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />

        <motion.div
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial="hidden"
          variants={containerVariants}
        >
          {/* Pioneer Badge */}
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-800/50 bg-purple-900/20 px-4 py-2 backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
            <span className='text-purple-300 text-sm'>First Cursor Ambassador from El Salvador 🇸🇻</span>
          </motion.div>

          <motion.h1 className='mb-6 font-bold text-4xl text-white sm:text-5xl lg:text-6xl' variants={itemVariants}>
            Cursor Ambassador
          </motion.h1>

          <motion.p className='mx-auto mb-8 max-w-2xl text-gray-400 text-lg sm:text-xl' variants={itemVariants}>
            Pioneering AI-powered development in Central America, building communities, and helping teams accelerate
            with Cursor
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={itemVariants}>
            <Link href="https://linkedin.com/in/wmoralesdev" target="_blank">
              <Button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </Button>
            </Link>
            <Link href="https://github.com/wmoralesdev" target="_blank">
              <Button
                className="group border-purple-800 bg-purple-900/20 text-purple-400 hover:bg-purple-800/30"
                variant="outline"
              >
                <Github className="mr-2 h-4 w-4" />
                View Templates
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 backdrop-blur-xl"
            variants={cardVariants}
          >
            <div className='-translate-y-32 absolute top-0 right-0 h-64 w-64 translate-x-32 rounded-full bg-purple-600/10 blur-3xl' />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                <span className='font-medium text-purple-400 text-sm'>Development Philosophy</span>
              </div>

              <h2 className='mb-4 font-bold text-2xl text-white'>Coexist with AI, Don't Depend on It</h2>

              <p className="text-gray-400 leading-relaxed">
                I believe in empowering developers to work alongside AI, not blindly accept its suggestions. Through
                strategic use of Cursor's features, we can accelerate development while maintaining code quality and
                understanding. My approach focuses on teaching developers to leverage AI as a powerful tool while
                keeping their critical thinking and expertise at the forefront.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Expertise Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            <motion.h2 className='mb-4 font-bold text-3xl text-white' variants={itemVariants}>
              Core Expertise
            </motion.h2>
            <motion.p className="text-gray-400" variants={itemVariants}>
              Specialized in the most powerful Cursor features for maximum productivity
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.1 }}
            whileInView="visible"
          >
            {expertiseAreas.map((area) => {
              const Icon = area.icon;
              return (
                <motion.div
                  className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-800/50"
                  key={area.title}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
                  />

                  <div className="relative z-10">
                    <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${area.gradient} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className='mb-2 font-semibold text-lg text-white'>{area.title}</h3>
                    <p className='text-gray-400 text-sm'>{area.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Community Building */}
            <motion.div
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm"
              variants={cardVariants}
            >
              <Users className="mb-4 h-8 w-8 text-purple-400" />
              <h3 className='mb-3 font-bold text-white text-xl'>Building LATAM's AI Dev Community</h3>
              <p className="mb-4 text-gray-400">
                Leading the charge to create a vibrant community of AI-powered developers across Latin America, starting
                with El Salvador and expanding throughout Central America.
              </p>
              <ul className="space-y-2">
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>In-person events and workshops</span>
                </li>
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>WhatsApp community for real-time support</span>
                </li>
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>Spanish-language resources and tutorials</span>
                </li>
              </ul>
            </motion.div>

            {/* Future Vision */}
            <motion.div
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm"
              variants={cardVariants}
            >
              <Sparkles className="mb-4 h-8 w-8 text-purple-400" />
              <h3 className='mb-3 font-bold text-white text-xl'>The Future is AI-Powered</h3>
              <p className="mb-4 text-gray-400">
                As Cursor continues to evolve with new features and improved developer experience, I'm committed to
                helping developers stay ahead of the curve.
              </p>
              <ul className="space-y-2">
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>Regular content on emerging Cursor features</span>
                </li>
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>Best practices for AI-assisted development</span>
                </li>
                <li className='flex items-start gap-2 text-gray-500 text-sm'>
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>Community-driven learning and growth</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            <motion.h2 className='mb-4 font-bold text-3xl text-white' variants={itemVariants}>
              How I Can Help Your Team
            </motion.h2>
            <motion.p className="text-gray-400" variants={itemVariants}>
              Accelerate your development with personalized training and consultation
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.1 }}
            whileInView="visible"
          >
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <motion.div
                  className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-800/50"
                  key={offering.title}
                  variants={cardVariants}
                >
                  <div className="mb-4 inline-flex rounded-lg bg-purple-900/50 p-3">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>

                  <h3 className='mb-2 font-semibold text-lg text-white'>{offering.title}</h3>
                  <p className='mb-4 text-gray-400 text-sm'>{offering.description}</p>

                  <ul className="space-y-2">
                    {offering.features.map((feature) => (
                      <li className='flex items-center gap-2 text-gray-500 text-sm' key={feature}>
                        <div className="h-1 w-1 rounded-full bg-purple-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center"
            initial="hidden"
            variants={itemVariants}
            viewport={{ once: true }}
            whileInView="visible"
          >
            <p className="mb-6 text-gray-400">Ready to accelerate your team's development with Cursor?</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="https://calendly.com/wmoralesdev" target="_blank">
                <Button
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Consultation
                </Button>
              </Link>
              <Link href="mailto:hello@wmorales.dev">
                <Button
                  className="border-purple-800 bg-purple-900/20 text-purple-400 hover:bg-purple-800/30"
                  size="lg"
                  variant="outline"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join the Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Preview */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          <motion.div
            className="rounded-xl border border-gray-800 bg-gradient-to-br from-purple-900/20 to-gray-900/50 p-8 backdrop-blur-sm"
            variants={cardVariants}
          >
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-purple-400" />
            <h3 className='mb-2 font-bold text-white text-xl'>Resources Coming Soon</h3>
            <p className="mb-6 text-gray-400">
              Blog posts, tutorials, and TikTok content on mastering Cursor and AI-powered development
            </p>
            <Badge className="border-purple-700/50 bg-purple-900/50 text-purple-300">
              <Sparkles className="mr-1 h-3 w-3" />
              Launching in /blog
            </Badge>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
