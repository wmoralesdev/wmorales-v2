import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";

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
      role: "Javascript Fullstack Developer",
      period: "Nov 2020 – Jan 2022",
      achievements: [
        "Developed enterprise software in Javascript and .NET",
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

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Work Experience
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            My professional journey building impactful solutions
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {exp.company}
                      {exp.current && (
                        <Badge variant="default" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-lg text-primary font-medium mt-1">
                      {exp.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm sm:text-base whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 