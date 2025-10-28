"use client";

import { Filter, Search, SortAsc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ProjectCategory,
  type ProjectFilter,
  type ProjectSort,
  ProjectStatus,
} from "@/lib/types/showcase.types";

interface ProjectFiltersProps {
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  sort: ProjectSort;
  onSortChange: (sort: ProjectSort) => void;
  totalProjects: number;
  filteredCount: number;
}

const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.WEB_APP]: "Web Application",
  [ProjectCategory.MOBILE_APP]: "Mobile App",
  [ProjectCategory.API]: "API/Backend",
  [ProjectCategory.LIBRARY]: "Library/Package",
  [ProjectCategory.TOOL]: "Tool/CLI",
  [ProjectCategory.GAME]: "Game",
  [ProjectCategory.AI_ML]: "AI/ML",
  [ProjectCategory.BLOCKCHAIN]: "Blockchain",
  [ProjectCategory.OTHER]: "Other",
};

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.COMPLETED]: "Completed",
  [ProjectStatus.MAINTAINED]: "Maintained",
  [ProjectStatus.ARCHIVED]: "Archived",
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
    onFilterChange({
      ...filter,
      categories: updated.length ? updated : undefined,
    });
  };

  const handleStatusToggle = (status: ProjectStatus) => {
    const statuses = filter.statuses || [];
    const updated = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    onFilterChange({
      ...filter,
      statuses: updated.length ? updated : undefined,
    });
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
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search projects..."
            value={filter.searchQuery || ""}
          />
        </div>

        {/* Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full sm:w-auto" variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Categories</h4>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <div className="flex items-center space-x-2" key={value}>
                      <Checkbox
                        checked={filter.categories?.includes(
                          value as ProjectCategory
                        )}
                        id={`category-${value}`}
                        onCheckedChange={() =>
                          handleCategoryToggle(value as ProjectCategory)
                        }
                      />
                      <Label
                        className="flex-1 cursor-pointer text-sm"
                        htmlFor={`category-${value}`}
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-medium">Status</h4>
                <div className="space-y-2">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <div className="flex items-center space-x-2" key={value}>
                      <Checkbox
                        checked={filter.statuses?.includes(
                          value as ProjectStatus
                        )}
                        id={`status-${value}`}
                        onCheckedChange={() =>
                          handleStatusToggle(value as ProjectStatus)
                        }
                      />
                      <Label
                        className="flex-1 cursor-pointer text-sm"
                        htmlFor={`status-${value}`}
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
                    checked={filter.featured === true}
                    id="featured"
                    onCheckedChange={handleFeaturedToggle}
                  />
                  <Label className="cursor-pointer text-sm" htmlFor="featured">
                    Featured Projects Only
                  </Label>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={clearFilters}
                    size="sm"
                    variant="outline"
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
          onValueChange={(value) => {
            const [field, direction] = value.split("-") as [
              ProjectSort["field"],
              ProjectSort["direction"],
            ];
            onSortChange({ field, direction });
          }}
          value={`${sort.field}-${sort.direction}`}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SortAsc className="mr-2 h-4 w-4" />
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
      <div className="text-muted-foreground text-sm">
        Showing {filteredCount} of {totalProjects} projects
      </div>
    </div>
  );
}
