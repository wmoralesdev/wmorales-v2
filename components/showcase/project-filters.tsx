'use client';

import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ProjectCategory, ProjectFilter, ProjectSort, ProjectStatus } from '@/lib/types/showcase.types';

interface ProjectFiltersProps {
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  sort: ProjectSort;
  onSortChange: (sort: ProjectSort) => void;
  totalProjects: number;
  filteredCount: number;
}

const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.WEB_APP]: 'Web Application',
  [ProjectCategory.MOBILE_APP]: 'Mobile App',
  [ProjectCategory.API]: 'API/Backend',
  [ProjectCategory.LIBRARY]: 'Library/Package',
  [ProjectCategory.TOOL]: 'Tool/CLI',
  [ProjectCategory.GAME]: 'Game',
  [ProjectCategory.AI_ML]: 'AI/ML',
  [ProjectCategory.BLOCKCHAIN]: 'Blockchain',
  [ProjectCategory.OTHER]: 'Other',
};

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_PROGRESS]: 'In Progress',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.MAINTAINED]: 'Maintained',
  [ProjectStatus.ARCHIVED]: 'Archived',
};

export function ProjectFilters({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  totalProjects,
  filteredCount,
}: ProjectFiltersProps) {
  const activeFilterCount = 
    (filter.categories?.length || 0) +
    (filter.statuses?.length || 0) +
    (filter.technologies?.length || 0) +
    (filter.years?.length || 0) +
    (filter.featured !== undefined ? 1 : 0);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, searchQuery: value });
  };

  const handleCategoryToggle = (category: ProjectCategory) => {
    const categories = filter.categories || [];
    const updated = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    onFilterChange({ ...filter, categories: updated.length ? updated : undefined });
  };

  const handleStatusToggle = (status: ProjectStatus) => {
    const statuses = filter.statuses || [];
    const updated = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    onFilterChange({ ...filter, statuses: updated.length ? updated : undefined });
  };

  const handleFeaturedToggle = () => {
    onFilterChange({
      ...filter,
      featured: filter.featured === undefined ? true : undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={filter.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${value}`}
                        checked={filter.categories?.includes(value as ProjectCategory) || false}
                        onCheckedChange={() => handleCategoryToggle(value as ProjectCategory)}
                      />
                      <Label
                        htmlFor={`category-${value}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${value}`}
                        checked={filter.statuses?.includes(value as ProjectStatus) || false}
                        onCheckedChange={() => handleStatusToggle(value as ProjectStatus)}
                      />
                      <Label
                        htmlFor={`status-${value}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filter.featured === true}
                    onCheckedChange={handleFeaturedToggle}
                  />
                  <Label htmlFor="featured" className="text-sm cursor-pointer">
                    Featured Projects Only
                  </Label>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort */}
        <Select
          value={`${sort.field}-${sort.direction}`}
          onValueChange={(value) => {
            const [field, direction] = value.split('-') as [ProjectSort['field'], ProjectSort['direction']];
            onSortChange({ field, direction });
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="category-asc">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalProjects} projects
      </div>
    </div>
  );
}