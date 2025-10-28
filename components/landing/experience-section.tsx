"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Calendar,
  Cloud,
  Code2,
  Rocket,
  Server,
  Sparkles,
  Users,
} from "lucide-react";

// Constants
const PULSE_SCALE_VALUES = [1, 1.2, 1];
const PULSE_DURATION = 2;

import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

// Animation variants following our style guide
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

const timelineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const experienceVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

// Icon mapping for companies
const companyIcons: Record<string, React.ElementType> = {
  Southworks: Cloud,
  Freelance: Rocket,
  Ravn: Server,
  Resultier: Code2,
  InnRoad: Building2,
  Elaniin: Code2,
  VincuHub: Users,
};

export function ExperienceSection() {
  const t = useTranslations("homepage.experience");
  const locale = useLocale();

  const experiences = [
    {
      company: "Southworks",
      role: t("companies.Southworks.role"),
      period: locale === "es" ? "Abr 2023 – Actualidad" : "Apr 2023 – Now",
      achievements: [
        t("companies.Southworks.achievements.0"),
        t("companies.Southworks.achievements.1"),
      ],
      current: true,
      color: "from-purple-600 to-pink-600",
    },
    {
      company: "Freelance",
      role: t("companies.Freelance.role"),
      period: locale === "es" ? "Abr 2023 – Ene 2024" : "Apr 2023 – Jan 2024",
      achievements: [
        t("companies.Freelance.achievements.0"),
        t("companies.Freelance.achievements.1"),
      ],
      color: "from-blue-600 to-purple-600",
    },
    {
      company: "Ravn",
      role: t("companies.Ravn.role"),
      period: locale === "es" ? "Ene 2023 – Mar 2023" : "Jan 2023 – Mar 2023",
      achievements: [
        t("companies.Ravn.achievements.0"),
        t("companies.Ravn.achievements.1"),
      ],
      color: "from-indigo-600 to-blue-600",
    },
    {
      company: "Resultier",
      role: t("companies.Resultier.role"),
      period: locale === "es" ? "Abr 2022 – Dic 2022" : "Apr 2022 – Dec 2022",
      achievements: [
        t("companies.Resultier.achievements.0"),
        t("companies.Resultier.achievements.1"),
      ],
      color: "from-green-600 to-teal-600",
    },
    {
      company: "InnRoad",
      role: t("companies.InnRoad.role"),
      period: locale === "es" ? "Abr 2021 – Abr 2022" : "Apr 2021 – Apr 2022",
      achievements: [
        t("companies.InnRoad.achievements.0"),
        t("companies.InnRoad.achievements.1"),
      ],
      color: "from-orange-600 to-red-600",
    },
    {
      company: "Elaniin",
      role: t("companies.Elaniin.role"),
      period: locale === "es" ? "Nov 2020 – Ene 2022" : "Nov 2020 – Jan 2022",
      achievements: [
        t("companies.Elaniin.achievements.0"),
        t("companies.Elaniin.achievements.1"),
      ],
      color: "from-yellow-600 to-orange-600",
    },
    {
      company: "VincuHub",
      role: t("companies.VincuHub.role"),
      period: locale === "es" ? "Ene 2020 – Nov 2020" : "Jan 2020 – Nov 2020",
      achievements: [
        t("companies.VincuHub.achievements.0"),
        t("companies.VincuHub.achievements.1"),
      ],
      color: "from-pink-600 to-purple-600",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2"
            variants={itemVariants}
          >
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="font-medium text-purple-400 text-sm">
              {t("sectionLabel")}
            </span>
          </motion.div>

          <motion.h2
            className="mb-4 font-bold text-3xl text-white sm:text-4xl lg:text-5xl"
            variants={itemVariants}
          >
            {t("sectionTitle")}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg"
            variants={itemVariants}
          >
            {t("sectionDescription")}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial="hidden"
          variants={timelineVariants}
          viewport={{ once: true, amount: 0.1 }}
          whileInView="visible"
        >
          {/* Central timeline line - gradient */}
          <motion.div
            className="lg:-translate-x-px absolute top-0 bottom-0 left-8 w-px lg:left-1/2"
            initial={{ scaleY: 0, originY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ scaleY: 1 }}
          >
            <div className="h-full w-full bg-gradient-to-b from-purple-500/50 via-purple-400/30 to-transparent" />
          </motion.div>

          <div className="space-y-12 lg:space-y-16">
            {experiences.map((exp, index) => {
              const Icon = companyIcons[exp.company] || Building2;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  className={`relative flex items-center ${isEven ? "lg:justify-start" : "lg:justify-end"}`}
                  key={exp.company + exp.role}
                  variants={experienceVariants}
                >
                  {/* Timeline dot with icon */}
                  <motion.div
                    className="lg:-translate-x-1/2 absolute left-8 lg:left-1/2"
                    variants={iconVariants}
                  >
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${exp.color} p-0.5`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {exp.current && (
                        <motion.div
                          animate={{ scale: PULSE_SCALE_VALUES }}
                          className="-right-1 -top-1 absolute h-4 w-4 rounded-full bg-green-500"
                          transition={{
                            duration: PULSE_DURATION,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="h-full w-full animate-ping rounded-full bg-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className={`ml-28 lg:ml-0 ${
                      isEven
                        ? "lg:mr-[calc(50%+4rem)]"
                        : "lg:ml-[calc(50%+4rem)]"
                    } group cursor-pointer`}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-800/50 hover:bg-gray-900/60">
                      {/* Gradient accent */}
                      <div
                        className={`absolute top-0 ${isEven ? "left-0" : "right-0"} h-full w-1 rounded-full bg-gradient-to-b ${exp.color} opacity-50 transition-opacity group-hover:opacity-100`}
                      />

                      {/* Header */}
                      <div className="mb-4">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg text-white transition-colors group-hover:text-purple-300">
                              {exp.company}
                            </h3>
                            <p className="mt-1 text-gray-400 text-sm">
                              {exp.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span className="whitespace-nowrap">
                              {exp.period}
                            </span>
                          </div>
                        </div>

                        {exp.current && (
                          <Badge className="border-green-500/30 bg-green-500/20 text-green-400 text-xs">
                            Current Position
                          </Badge>
                        )}
                      </div>

                      {/* Achievements */}
                      <ul className="space-y-2">
                        {exp.achievements.map(
                          (achievement, achievementIndex) => (
                            <motion.li
                              className="flex items-start gap-2 text-gray-400 text-sm"
                              initial={{ opacity: 0, x: isEven ? -10 : 10 }}
                              key={achievement}
                              transition={{
                                delay: achievementIndex * 0.1,
                                duration: 0.3,
                              }}
                              viewport={{ once: true }}
                              whileInView={{ opacity: 1, x: 0 }}
                            >
                              <span
                                className={`inline-block h-1 w-1 rounded-full bg-gradient-to-r ${exp.color} mt-1.5 flex-shrink-0`}
                              />
                              <span className="transition-colors group-hover:text-gray-300">
                                {achievement}
                              </span>
                            </motion.li>
                          )
                        )}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
