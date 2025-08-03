'use client';

import Image from 'next/image';
import { ExternalLink, Github, Calendar, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, ProjectStatus } from '@/lib/types/showcase.types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_PROGRESS]: 'bg-yellow-500/10 text-yellow-500',
  [ProjectStatus.COMPLETED]: 'bg-green-500/10 text-green-500',
  [ProjectStatus.MAINTAINED]: 'bg-blue-500/10 text-blue-500',
  [ProjectStatus.ARCHIVED]: 'bg-gray-500/10 text-gray-500',
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.images.thumbnail ? (
          <Image
            src={project.images.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
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
            variant="outline"
            className={cn('shrink-0', statusColors[project.status])}
          >
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech.name} variant="secondary" className="text-xs">
              {tech.name}
            </Badge>
          ))}
          {project.technologies.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 5}
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        <div className="flex gap-2 mt-auto pt-2">
          {project.links.github && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {project.links.live && (
            <Button variant="default" size="sm" className="flex-1" asChild>
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
