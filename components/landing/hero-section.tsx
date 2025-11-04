"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { InteractiveTerminal } from "@/components/landing/interactive-terminal";
import { Button } from "@/components/ui/button";

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

export function HeroSection() {
  const t = useTranslations("homepage.hero");

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-0">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex min-h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left side - Text content */}
          <motion.div
            animate="visible"
            className="order-2 space-y-8 py-12 text-center lg:order-1 lg:py-0 lg:text-left"
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div className="space-y-6" variants={itemVariants}>
              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <div className="relative">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-green-500" />
                </div>
                <span className="font-medium text-green-600 text-xs dark:text-green-400">
                  {t("availableForNewProjects")}
                </span>
              </div>

              {/* Main heading with profile picture */}
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-purple-500/30 shadow-purple-500/20 shadow-xl lg:h-32 lg:w-32">
                    <Image
                      alt="Walter Morales"
                      className="object-cover"
                      fill
                      priority
                      src="/me.jpeg"
                    />
                  </div>
                  <div className="space-y-4">
                    <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
                      {t("greeting")}{" "}
                      <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite] text-4xl">
                        👋
                      </span>
                    </h1>
                    <h2 className="font-medium text-muted-foreground text-lg sm:text-xl lg:text-2xl">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        <Image
                          alt="Cursor Logo"
                          className="inline-block"
                          height={18}
                          src="/cube-2d-dark.svg"
                          width={18}
                        />
                        {t("role1")}
                      </span>
                      <span className="mx-2 text-muted-foreground">|</span>
                      {t("role2")}
                      <span className="mx-2 text-muted-foreground">|</span>
                      {t("role3")}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed lg:mx-0 lg:text-lg">
                {t("tagline")}
              </p>

              {/* Email */}
              <div className="flex flex-col items-center gap-4 text-muted-foreground text-sm md:flex-row md:items-center">
                <Button
                  asChild
                  className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
                >
                  <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3le7owokGKyKwsSTL9NavJ_kVj19-XBgqzGbwLcx5Q8qmSQNOK-C0rYCpJqDumc8mHycf9P-lg?gv=true">
                    {t("getStarted")}
                  </a>
                </Button>
                <span className="mr-2">/</span>
                <a
                  className="transition-colors hover:text-purple-400"
                  href="mailto:hello@wmorales.dev"
                >
                  hello@wmorales.dev
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Terminal */}
          <motion.div
            animate="visible"
            className="order-1 w-full py-8 lg:order-2 lg:py-0"
            initial="hidden"
            variants={containerVariants}
          >
            <InteractiveTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
