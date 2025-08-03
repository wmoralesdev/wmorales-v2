'use client';

import { useState } from 'react';
import {
  Project,
  ProjectFilter,
  ProjectSort,
} from '@/lib/types/showcase.types';
import { ProjectGrid } from './project-grid';
import { ProjectFilters } from './project-filters';
import { projects as allProjects } from '@/lib/data/projects';

export function ShowcaseContent() {
  const [projects] = useState<Project[]>(allProjects);
  const [filter, setFilter] = useState<ProjectFilter>({});
  const [sort, setSort] = useState<ProjectSort>({
    field: 'date',
    direction: 'desc',
  });

  // Filter projects based on current filter
  const filteredProjects = projects.filter((project) => {
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    if (
      filter.categories?.length &&
      !filter.categories.includes(project.category)
    ) {
      return false;
    }

    if (filter.statuses?.length && !filter.statuses.includes(project.status)) {
      return false;
    }

    if (filter.technologies?.length) {
      const projectTechNames = project.technologies.map((t) => t.name);
      const hasMatchingTech = filter.technologies.some((tech) =>
        projectTechNames.includes(tech)
      );
      if (!hasMatchingTech) return false;
    }

    if (filter.years?.length && !filter.years.includes(project.year)) {
      return false;
    }

    if (filter.featured !== undefined && project.featured !== filter.featured) {
      return false;
    }

    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;

    switch (sort.field) {
      case 'date':
        return (b.year - a.year) * direction;
      case 'title':
        return a.title.localeCompare(b.title) * direction;
      case 'category':
        return a.category.localeCompare(b.category) * direction;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <ProjectFilters
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        totalProjects={projects.length}
        filteredCount={sortedProjects.length}
      />

      {/* Projects Grid */}
      <ProjectGrid projects={sortedProjects} />

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
