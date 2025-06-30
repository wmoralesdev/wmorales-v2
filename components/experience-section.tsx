"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function ExperienceSection() {
  const experiences = [
    {
      company: "Southworks",
      role: "Sr Software Engineer",
      period: "Apr 2023 – Now",
      achievements: [
        "Developed cloud-based solutions using .NET & NodeJS + ReactJS",
        "Mentored junior engineers"
      ],
      current: true
    },
    {
      company: "Freelance",
      role: "Product Engineer",
      period: "Apr 2023 – Jan 2024",
      achievements: [
        "Architected and led development of a government web service application",
        "Delivered project on time and within budget"
      ]
    },
    {
      company: "Ravn",
      role: "Sr Software Engineer",
      period: "Jan 2023 – Mar 2023",
      achievements: [
        "API migration to .NET environment",
        "Provided technical consultancy"
      ]
    },
    {
      company: "Resultier",
      role: ".NET Developer",
      period: "Apr 2022 – Dec 2022",
      achievements: [
        "Built medical software for patient vital sign analysis",
        "Collaborated with cross-functional teams"
      ]
    },
    {
      company: "InnRoad",
      role: "Software Engineer",
      period: "Apr 2021 – Apr 2022",
      achievements: [
        "Developed microservices for Airbnb and Hotel Booking integrations",
        "Enhanced system reliability and uptime"
      ]
    },
    {
      company: "Elaniin",
      role: "JavaScript Fullstack Developer",
      period: "Nov 2020 – Jan 2022",
      achievements: [
        "Developed enterprise software in JavaScript and .NET",
        "Led migration to cloud infrastructure"
      ]
    },
    {
      company: "VincuHub",
      role: "Fullstack Developer",
      period: "Jan 2020 – Nov 2020",
      achievements: [
        "Created and managed .NET applications and ReactJS websites",
        "Improved deployment pipeline, reducing release time by 30%"
      ]
    }
  ];

  // Animation variants with correct TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardHoverVariants = {
    rest: {
      scale: 1,
      x: 0,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.01,
      x: 8,
      boxShadow: "0 8px 25px rgba(168, 85, 247, 0.12)",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 15,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const badgeVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: 1,
      transition: {
        duration: 0.2,
        type: "spring" as const,
        stiffness: 300
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            variants={headerVariants}
          >
            Work Experience
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-muted-foreground"
            variants={headerVariants}
          >
            My professional journey building impactful solutions
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Main timeline line */}
          <motion.div
            className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-400 via-purple-300 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                initial="rest"
                className="relative"
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-3 top-4 w-2 h-2 bg-purple-400 rounded-full border-2 border-background z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 + 0.3, duration: 0.3, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.5, backgroundColor: "#a855f7" }}
                />

                <motion.div variants={cardHoverVariants} className="ml-8">
                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <motion.div
                            className="flex items-center gap-2 mb-1 flex-wrap"
                            whileHover="hover"
                            initial="rest"
                          >
                            <motion.div variants={iconVariants}>
                              <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
                            </motion.div>
                            <motion.h3
                              className="text-lg font-semibold truncate"
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              {exp.company}
                            </motion.h3>
                            {exp.current && (
                              <motion.div
                                variants={badgeVariants}
                                whileHover="hover"
                                initial="rest"
                              >
                                <Badge
                                  variant="default"
                                  className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"
                                >
                                  Current
                                </Badge>
                              </motion.div>
                            )}
                          </motion.div>

                          <motion.p
                            className="text-primary font-medium mb-2 text-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 + 0.4, duration: 0.4 }}
                          >
                            {exp.role}
                          </motion.p>

                          <motion.ul className="space-y-1">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <motion.li
                                key={achievementIndex}
                                className="flex items-start gap-2 text-xs sm:text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: index * 0.08 + achievementIndex * 0.05 + 0.5,
                                  duration: 0.3
                                }}
                                whileHover={{ x: 2 }}
                              >
                                <motion.div
                                  className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0"
                                  whileHover={{ scale: 1.5 }}
                                />
                                <span className="text-muted-foreground leading-relaxed">
                                  {achievement}
                                </span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>

                        <motion.div
                          className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </motion.div>
                          <span className="text-xs sm:text-sm whitespace-nowrap">
                            {exp.period}
                          </span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 