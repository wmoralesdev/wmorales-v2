import { Award, Code, Star, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Cursor - Walter Morales',
  description: 'My journey as a Cursor Ambassador with achievements, projects, and community contributions.',
};

export default function CursorPage() {
  const badges = [
    {
      name: 'Cursor Ambassador',
      icon: Award,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    },
    {
      name: 'AI Code Assistant Power User',
      icon: Zap,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    },
    {
      name: 'Community Contributor',
      icon: Users,
      color: 'bg-gradient-to-r from-green-500 to-teal-500',
    },
    {
      name: 'Code Mentor',
      icon: Code,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  ];

  const projects = [
    {
      name: 'AI-Powered Portfolio',
      description: 'Built this portfolio using Cursor AI assistance',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'shadcn/ui'],
    },
    {
      name: 'Cursor Community Guide',
      description: 'Comprehensive guide for new Cursor users',
      tech: ['Documentation', 'Best Practices', 'Tutorials'],
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 animate-fade-in-up font-bold text-4xl sm:text-5xl">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Cursor Ambassador
            </span>
          </h1>
          <p className="animate-delay-200 animate-fade-in-up text-lg text-muted-foreground sm:text-xl">
            Leveraging AI to build better software, faster
          </p>
        </div>

        {/* Badges */}
        <div className="mb-12 grid animate-delay-400 animate-fade-in-up grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, _index) => (
            <Card className="text-center transition-shadow hover:shadow-lg" key={badge.name}>
              <CardContent className="p-6">
                <div className={`h-16 w-16 rounded-full ${badge.color} mx-auto mb-4 flex items-center justify-center`}>
                  <badge.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects */}
        <div className="animate-delay-600 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Cursor Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {projects.map((project, _index) => (
                  <div className="space-y-3" key={project.name}>
                    <h4 className="font-semibold text-lg">{project.name}</h4>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge className="text-xs" key={tech} variant="secondary">
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
        <div className="mt-8 animate-delay-800 animate-fade-in-up">
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
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Helped 100+ developers adopt AI-assisted coding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Created educational content for Cursor best practices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
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
