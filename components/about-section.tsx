import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Globe, GraduationCap, Heart } from "lucide-react";

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

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Software Engineer | Cursor Ambassador
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experienced Software Engineer with a focus on .NET, JavaScript, and cloud technologies.
            I love building scalable products and collaborating with global teams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Main Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm px-3 py-1 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currently Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Currently Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                LLMs, AI, and Web3 technologies to stay at the forefront of innovation.
              </p>
            </CardContent>
          </Card>

          {/* Fun Fact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Fun Fact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                I'm a big fan of Japanese culture! 🇯🇵
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 