"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Linkedin, Instagram, Github, Coffee } from "lucide-react";

export function ContactSection() {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/walter-morales-dev/",
      color: "hover:text-blue-500"
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/wmoralesdev",
      color: "hover:text-gray-400"
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/wmorales.dev",
      color: "hover:text-pink-500"
    }
  ];

  const handleEmailClick = () => {
    window.location.href = "mailto:walterrafael26@gmail.com";
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Ready to bring your ideas to life? Let's start the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Feel free to reach out via email or connect with me on social media.
                </p>
                <Button
                  onClick={handleEmailClick}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  walterrafael26@gmail.com
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Follow me on:</p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`${social.color} transition-colors`}
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Let's Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                A coffee chat is the best way to start a new project. Whether you have a
                clear vision or just an idea, I'd love to help you build something amazing.
              </p>
              <Button
                onClick={handleEmailClick}
                size="lg"
                className="w-full"
              >
                Start a Conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 