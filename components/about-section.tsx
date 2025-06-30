"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Globe, GraduationCap, Heart } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  const skills = [
    ".NET", "JavaScript", "TypeScript", "ReactJS", "NextJS", "NestJS",
    "PostgreSQL", "MongoDB", "SQL Server", "Tailwind CSS", "Docker", "AWS", "Azure",
    "ShadCN", "Supabase", "Firebase", "Vercel", "Vercel AI SDK", "Cursor", "Expo",
  ];

  const stats = [
    { icon: Code, label: "Years of experience", value: "5+" },
    { icon: Globe, label: "Countries", value: "10+" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const skillBadgeVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      rotate: -2
    }
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Software Engineer | Cursor Ambassador
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Experienced Software Engineer with a focus on .NET, JavaScript, and cloud technologies.
            I love building scalable products and collaborating with global teams.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover="hover"
                initial="rest"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="text-center cursor-pointer">
                    <CardContent className="p-6">
                      <motion.div variants={iconVariants}>
                        <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      </motion.div>
                      <motion.div
                        className="text-2xl sm:text-3xl font-bold text-primary mb-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <motion.div
              whileHover="hover"
              initial="rest"
              variants={cardHoverVariants}
            >
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Code className="h-5 w-5" />
                    </motion.div>
                    Main Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                  >
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8, y: 20 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              duration: 0.4,
                              ease: "easeOut"
                            }
                          }
                        }}
                        whileHover="hover"
                        whileTap="tap"
                        initial="rest"
                      >
                        <motion.div variants={skillBadgeVariants}>
                          <Badge
                            variant="secondary"
                            className="text-sm px-3 py-1 bg-muted hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 cursor-pointer"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Currently Learning */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="rest"
              variants={cardHoverVariants}
            >
              <Card className="cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GraduationCap className="h-5 w-5" />
                    </motion.div>
                    Currently Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    LLMs, AI, and Web3 technologies to stay at the forefront of innovation.
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="rest"
              variants={cardHoverVariants}
            >
              <Card className="cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    >
                      <Heart className="h-5 w-5 text-red-400" />
                    </motion.div>
                    Fun Fact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    I'm a big fan of Japanese culture!{" "}
                    <motion.span
                      className="inline-block"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      🇯🇵
                    </motion.span>
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 