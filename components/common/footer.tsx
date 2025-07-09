'use client';

import { motion, type Variants } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Send, Sparkles, Twitter } from 'lucide-react';
import Link from 'next/link';

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

const socialLinks = [
  { icon: Github, href: 'https://github.com/wmoralesdev', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/wmoralesdev', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/wmoralesdev', label: 'Twitter' },
  { icon: Mail, href: 'mailto:hello@wmorales.dev', label: 'Email' },
];

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Guestbook', href: '/guestbook' },
  { name: 'Polls', href: '/polls' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-32 overflow-hidden bg-black">
      {/* Top gradient accent */}
      <div className='absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent' />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />

      <div className="relative z-10">
        <motion.div
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
            {/* Brand & Status */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="mb-6">
                <h3 className='mb-2 font-bold text-2xl text-white'>Walter Morales</h3>
                <p className="text-gray-400">Full Stack Developer & Cursor Ambassador</p>
              </div>

              {/* Availability status */}
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-sm">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500" />
                </div>
                <span className='text-gray-300 text-sm'>Available for opportunities</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">El Salvador 🇸🇻 • Working globally</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className='mb-4 font-semibold text-purple-400 text-sm'>Quick Links</h4>
              <ul className="space-y-2">
                {navigation.map((link) => (
                  <li key={link.name}>
                    <Link className='text-gray-400 text-sm transition-colors hover:text-purple-400' href={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connect */}
            <motion.div variants={itemVariants}>
              <h4 className='mb-4 font-semibold text-purple-400 text-sm'>Let's Connect</h4>

              {/* Social links */}
              <div className="mb-6 flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      className="group relative"
                      href={social.href}
                      key={social.label}
                      rel="noopener noreferrer"
                      target="_blank"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-2 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-700/50 group-hover:bg-purple-900/20">
                        <Icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-purple-400" />
                      </div>
                      <span className="sr-only">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA */}
              <Link href="mailto:hello@wmorales.dev">
                <motion.button
                  className='group flex items-center gap-2 rounded-lg border border-purple-700/50 bg-purple-900/20 px-4 py-2 font-medium text-purple-400 text-sm backdrop-blur-sm transition-all hover:bg-purple-800/30 hover:text-purple-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  Get in touch
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom section */}
          <motion.div className='mt-12 border-gray-800/50 border-t pt-8' variants={itemVariants}>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className='flex items-center gap-2 text-gray-500 text-sm'>
                <Sparkles className="h-4 w-4 text-purple-500/50" />
                <p>
                  © {currentYear} Walter Morales. Crafted with{' '}
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    className="inline-block text-purple-400"
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 5,
                    }}
                  >
                    ♥
                  </motion.span>
                </p>
              </div>

              <div className='flex items-center gap-2 text-gray-500 text-sm'>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                  <span>Next.js</span>
                </div>
                <span className="text-gray-700">•</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                  <span>Tailwind CSS</span>
                </div>
                <span className="text-gray-700">•</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                  <span>TypeScript</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
