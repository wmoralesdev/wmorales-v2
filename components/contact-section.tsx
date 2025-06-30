'use client';

import { motion } from 'framer-motion';
import { Coffee, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ContactSection() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/walter-morales-dev/',
      color: 'hover:text-blue-500',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/wmoralesdev',
      color: 'hover:text-gray-400',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/wmorales.dev',
      color: 'hover:text-pink-500',
    },
  ];

  const handleEmailClick = () => {
    window.location.href = 'mailto:walterrafael26@gmail.com';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardHoverVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow: '0 20px 40px rgba(168, 85, 247, 0.15)',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 12,
      scale: 1.2,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const socialIconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const buttonVariants = {
    rest: { scale: 1, boxShadow: '0 2px 10px rgba(168, 85, 247, 0.2)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.h2 className="mb-4 font-bold text-3xl sm:text-4xl md:text-5xl" variants={itemVariants}>
            Let's Work Together
          </motion.h2>
          <motion.p className="text-lg text-muted-foreground sm:text-xl" variants={itemVariants}>
            Ready to bring your ideas to life? Let's start the conversation.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          {/* Contact Info */}
          <motion.div initial="rest" variants={cardVariants} whileHover="hover">
            <motion.div variants={cardHoverVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div variants={iconVariants}>
                      <Mail className="h-5 w-5" />
                    </motion.div>
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <motion.p
                      className="mb-4 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1 }}
                    >
                      Feel free to reach out via email or connect with me on social media.
                    </motion.p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full sm:w-auto" onClick={handleEmailClick} variant="outline">
                        <motion.div
                          className="flex items-center gap-2"
                          transition={{ duration: 0.2 }}
                          whileHover={{ x: 2 }}
                        >
                          <Mail className="h-4 w-4" />
                          walterrafael26@gmail.com
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>

                  <div>
                    <p className="mb-3 text-muted-foreground text-sm">Follow me on:</p>
                    <motion.div
                      className="flex gap-4"
                      initial="hidden"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                      viewport={{ once: true }}
                      whileInView="visible"
                    >
                      {socialLinks.map((social) => (
                        <motion.div
                          initial="rest"
                          key={social.name}
                          variants={{
                            hidden: { opacity: 0, scale: 0.5, rotate: -180 },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              rotate: 0,
                              transition: {
                                duration: 0.5,
                                type: 'spring' as const,
                                stiffness: 200,
                              },
                            },
                          }}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <motion.div variants={socialIconVariants}>
                            <Button asChild className={`${social.color} transition-colors`} size="sm" variant="ghost">
                              <a aria-label={social.name} href={social.href} rel="noopener noreferrer" target="_blank">
                                <social.icon className="h-5 w-5" />
                              </a>
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div initial="rest" variants={cardVariants} whileHover="hover">
            <motion.div variants={cardHoverVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 5,
                      }}
                    >
                      <Coffee className="h-5 w-5" />
                    </motion.div>
                    Let's Collaborate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="mb-6 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1 }}
                  >
                    A coffee chat is the best way to start a new project. Whether you have a clear vision or just an
                    idea, I'd love to help you build something amazing.
                  </motion.p>
                  <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={handleEmailClick}
                      size="lg"
                    >
                      Start a Conversation
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
