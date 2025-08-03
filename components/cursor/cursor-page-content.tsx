'use client';

import { motion, type Variants } from 'framer-motion';
import {
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
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Animation variants matching style guidelines
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
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

export function CursorPageContent() {
  const t = useTranslations('cursor');

  const expertiseAreas = [
    {
      title: t('expertise.tabCompletion.title'),
      description: t('expertise.tabCompletion.description'),
      icon: Zap,
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      title: t('expertise.inlineEdit.title'),
      description: t('expertise.inlineEdit.description'),
      icon: Code2,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: t('expertise.agenticPrompts.title'),
      description: t('expertise.agenticPrompts.description'),
      icon: MessageCircle,
      gradient: 'from-green-500 to-teal-600',
    },
  ];

  const offerings = [
    {
      title: t('services.teamTraining.title'),
      description: t('services.teamTraining.description'),
      features: [
        t('services.teamTraining.features.workshops'),
        t('services.teamTraining.features.bestPractices'),
        t('services.teamTraining.features.customWorkflows'),
      ],
      icon: Users,
    },
    {
      title: t('services.consultations.title'),
      description: t('services.consultations.description'),
      features: [
        t('services.consultations.features.personalizedGuidance'),
        t('services.consultations.features.workflowOptimization'),
        t('services.consultations.features.advancedTechniques'),
      ],
      icon: Calendar,
    },
    {
      title: t('services.communityAccess.title'),
      description: t('services.communityAccess.description'),
      features: [
        t('services.communityAccess.features.whatsappGroup'),
        t('services.communityAccess.features.resourceSharing'),
        t('services.communityAccess.features.peerSupport'),
      ],
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        </div>

        <motion.div
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial="hidden"
          variants={containerVariants}
        >
          {/* Pioneer Badge with glassmorphism */}
          <motion.div variants={itemVariants}>
            <motion.div
              animate="animate"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/20 px-4 py-2 backdrop-blur-xl"
              variants={floatVariants}
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              <span className="font-medium text-purple-300 text-xs lg:text-sm">
                {t('pioneer')}
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-4xl text-transparent sm:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-gray-400 text-lg sm:text-xl"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA Buttons with proper styling */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Link href="https://linkedin.com/in/wmoralesdev" target="_blank">
              <Button className="group rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25">
                <Linkedin className="mr-2 h-4 w-4" />
                {t('connectLinkedIn')}
              </Button>
            </Link>
            <Link href="https://github.com/wmoralesdev" target="_blank">
              <Button
                className="group rounded-full border-purple-500/50 bg-transparent px-8 py-6 text-purple-300 backdrop-blur-xl transition-all duration-300 hover:bg-purple-500/20"
                variant="outline"
              >
                <Github className="mr-2 h-4 w-4" />
                {t('viewTemplates')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section with glassmorphism */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gray-900/80 p-8 backdrop-blur-xl"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="-translate-y-32 absolute top-0 right-0 h-64 w-64 translate-x-32 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-300 text-xs">
                  {t('philosophy.label')}
                </span>
              </div>

              <h2 className="mb-4 font-bold text-2xl text-white">
                {t('philosophy.title')}
              </h2>

              <p className="text-gray-400 leading-relaxed">
                {t('philosophy.description')}
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
            <motion.h2
              className="mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text font-bold text-3xl text-transparent"
              variants={itemVariants}
            >
              {t('expertiseTitle')}
            </motion.h2>
            <motion.p className="text-gray-400" variants={itemVariants}>
              {t('expertiseSubtitle')}
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
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-gray-900/80 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50"
                  key={area.title}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${area.gradient} p-3`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="mb-2 font-semibold text-lg text-white">
                      {area.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{area.description}</p>
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
              className="rounded-xl border border-gray-800 bg-gray-900/80 p-8 backdrop-blur-xl transition-all hover:border-purple-500/50"
              variants={cardVariants}
              whileHover="hover"
            >
              <Users className="mb-4 h-8 w-8 text-purple-400" />
              <h3 className="mb-3 font-bold text-white text-xl">
                {t('community.title')}
              </h3>
              <p className="mb-4 text-gray-400">{t('community.description')}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('community.features.events')}</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('community.features.whatsapp')}</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('community.features.spanish')}</span>
                </li>
              </ul>
            </motion.div>

            {/* Future Vision */}
            <motion.div
              className="rounded-xl border border-gray-800 bg-gray-900/80 p-8 backdrop-blur-xl transition-all hover:border-purple-500/50"
              variants={cardVariants}
              whileHover="hover"
            >
              <Sparkles className="mb-4 h-8 w-8 text-purple-400" />
              <h3 className="mb-3 font-bold text-white text-xl">
                {t('future.title')}
              </h3>
              <p className="mb-4 text-gray-400">{t('future.description')}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('future.features.content')}</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('future.features.bestPractices')}</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <span className="mt-1.5 block h-1 w-1 rounded-full bg-purple-400" />
                  <span>{t('future.features.learning')}</span>
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
            <motion.h2
              className="mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text font-bold text-3xl text-transparent"
              variants={itemVariants}
            >
              {t('servicesTitle')}
            </motion.h2>
            <motion.p className="text-gray-400" variants={itemVariants}>
              {t('servicesSubtitle')}
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
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-black/80 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50"
                  key={offering.title}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-4 inline-flex rounded-lg bg-purple-500/20 p-3">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>

                    <h3 className="mb-2 font-semibold text-lg text-white">
                      {offering.title}
                    </h3>
                    <p className="mb-4 text-gray-400 text-sm">
                      {offering.description}
                    </p>

                    <ul className="space-y-2">
                      {offering.features.map((feature) => (
                        <li
                          className="flex items-center gap-2 text-gray-500 text-xs"
                          key={feature}
                        >
                          <div className="h-1 w-1 rounded-full bg-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
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
            <p className="mb-6 text-gray-400">{t('cta.question')}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="https://calendly.com/wmoralesdev" target="_blank">
                <Button
                  className="group rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('cta.schedule')}
                </Button>
              </Link>
              <Link href="mailto:hello@wmorales.dev">
                <Button
                  className="rounded-full border-purple-500/50 bg-transparent px-8 py-6 text-purple-300 backdrop-blur-xl transition-all duration-300 hover:bg-purple-500/20"
                  size="lg"
                  variant="outline"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('cta.joinCommunity')}
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
            className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-gray-900/50 p-8 backdrop-blur-xl"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-purple-400" />
            <h3 className="mb-2 font-bold text-white text-xl">
              {t('resources.title')}
            </h3>
            <p className="mb-6 text-gray-400">{t('resources.description')}</p>
            <Badge className="border-purple-500/30 bg-purple-500/20 text-purple-300">
              <Sparkles className="mr-1 h-3 w-3" />
              {t('resources.launchingIn')}
            </Badge>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
