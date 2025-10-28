"use client";

import { Calendar, ExternalLink, Github, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Project, ProjectStatus } from "@/lib/types/showcase.types";
import { cn } from "@/lib/utils";

// Constants
const MAX_TECH_DISPLAY = 5;

type ProjectCardProps = {
  project: Project;
};

const statusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_PROGRESS]: "bg-yellow-500/10 text-yellow-500",
  [ProjectStatus.COMPLETED]: "bg-green-500/10 text-green-500",
  [ProjectStatus.MAINTAINED]: "bg-blue-500/10 text-blue-500",
  [ProjectStatus.ARCHIVED]: "bg-gray-500/10 text-gray-500",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.images.thumbnail ? (
          <Image
            alt={project.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            src={project.images.thumbnail}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-muted-foreground">🚀</span>
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{project.title}</CardTitle>
          <Badge
            className={cn("shrink-0", statusColors[project.status])}
            variant="outline"
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, MAX_TECH_DISPLAY).map((tech) => (
            <Badge className="text-xs" key={tech.name} variant="secondary">
              {tech.name}
            </Badge>
          ))}
          {project.technologies.length > MAX_TECH_DISPLAY && (
            <Badge className="text-xs" variant="secondary">
              +{project.technologies.length - MAX_TECH_DISPLAY}
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{project.year}</span>
          </div>
          {project.team && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{project.team.length}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          {project.links.github && (
            <Button asChild className="flex-1" size="sm" variant="outline">
              <a
                href={project.links.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="mr-1 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
          {project.links.live && (
            <Button asChild className="flex-1" size="sm" variant="default">
              <a
                href={project.links.live}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
