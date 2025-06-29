import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Award, Users, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Cursor - Walter Morales",
  description: "My journey as a Cursor Ambassador with achievements, projects, and community contributions.",
};

export default function CursorPage() {
  const badges = [
    { name: "Cursor Ambassador", icon: Award, color: "bg-gradient-to-r from-blue-500 to-purple-600" },
    { name: "AI Code Assistant Power User", icon: Zap, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
    { name: "Community Contributor", icon: Users, color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { name: "Code Mentor", icon: Code, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  ];

  const projects = [
    {
      name: "AI-Powered Portfolio",
      description: "Built this portfolio using Cursor AI assistance",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"]
    },
    {
      name: "Cursor Community Guide",
      description: "Comprehensive guide for new Cursor users",
      tech: ["Documentation", "Best Practices", "Tutorials"]
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Cursor Ambassador
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground animate-fade-in-up animate-delay-200">
            Leveraging AI to build better software, faster
          </p>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up animate-delay-400">
          {badges.map((badge, index) => (
            <Card key={badge.name} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-4`}>
                  <badge.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects */}
        <div className="animate-fade-in-up animate-delay-600">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Cursor Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <div key={project.name} className="space-y-3">
                    <h4 className="font-semibold text-lg">{project.name}</h4>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mt-8 animate-fade-in-up animate-delay-800">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Helped 100+ developers adopt AI-assisted coding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Created educational content for Cursor best practices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Active community member and mentor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 