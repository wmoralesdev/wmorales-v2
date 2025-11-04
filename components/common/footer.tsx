"use client";

import { motion, type Variants } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EMAIL } from "@/lib/consts";

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
      ease: "easeOut",
    },
  },
};

const socialLinks = [
  { icon: Github, href: "https://github.com/wmoralesdev", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/wmoralesdev",
    label: "LinkedIn",
  },
  { icon: Twitter, href: "https://twitter.com/wmoralesdev", label: "Twitter" },
  { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("guestbook"), href: "/guestbook" },
    { name: t("events"), href: "/events" },
    { name: t("cursor"), href: "/cursor" },
  ];

  return (
    <footer className="relative z-50 overflow-hidden bg-background">
      {/* Top gradient accent */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

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
                <h3 className="mb-2 font-bold text-2xl text-foreground">
                  Walter Morales
                </h3>
                <p className="text-muted-foreground">
                  {t("title")} & {t("cursorAmbassador")}
                </p>
              </div>

              {/* Availability status */}
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 px-4 py-2 backdrop-blur-sm">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500" />
                </div>
                <span className="text-foreground text-sm">
                  {t("availableForOpportunities")}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{t("location")}</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="mb-4 font-semibold text-purple-600 text-sm dark:text-purple-400">
                {t("quickLinks")}
              </h4>
              <ul className="space-y-2">
                {navigation.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors hover:text-purple-600 dark:hover:text-purple-400"
                      href={link.href}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connect */}
            <motion.div variants={itemVariants}>
              <h4 className="mb-4 font-semibold text-purple-600 text-sm dark:text-purple-400">
                {t("letsConnect")}
              </h4>

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
                      <div className="rounded-lg border border-border bg-muted/50 p-2 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500/50 group-hover:bg-purple-500/10">
                        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      </div>
                      <span className="sr-only">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA */}
              <Link href={`mailto:${EMAIL}`}>
                <motion.button
                  className="group flex items-center gap-2 rounded-lg border border-purple-500/50 bg-purple-500/10 px-4 py-2 font-medium text-purple-600 text-sm backdrop-blur-sm transition-all hover:bg-purple-500/20 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  {t("getInTouch")}
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom section */}
          <motion.div
            className="mt-12 border-border border-t pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Sparkles className="h-4 w-4 text-purple-500/50" />
                <p>
                  {t("copyright", { year: currentYear })}{" "}
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    className="inline-block text-purple-600 dark:text-purple-400"
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

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                  <span>Next.js</span>
                </div>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                  <span>Tailwind CSS</span>
                </div>
                <span className="text-muted-foreground/50">•</span>
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
