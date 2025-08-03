'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { getSearchSuggestions } from '@/app/actions/blog.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const AVAILABLE_TAGS = [
  { label: 'AI/ML', value: 'ai-ml' },
  { label: 'Web Development', value: 'web-dev' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Career', value: 'career' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Cursor', value: 'cursor' },
];

const SORT_OPTIONS = [
  { label: 'Latest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
  { label: 'Title A-Z', value: 'title-asc' },
  { label: 'Title Z-A', value: 'title-desc' },
  { label: 'Featured First', value: 'featured-first' },
];

type SearchSuggestion = {
  type: 'title' | 'description';
  text: string;
  slug: string;
  title: string;
};

type TagWithCount = {
  label: string;
  value: string;
  count: number;
};

type SearchbarProps = {
  query?: string;
  tags?: string[];
  sortBy?: string;
  showFeatured?: boolean;
  totalPosts?: number;
  filteredCount?: number;
  availableTags?: TagWithCount[];
};

export function Searchbar({
  query = '',
  tags = [],
  sortBy = 'date-desc',
  showFeatured = false,
  totalPosts = 0,
  filteredCount = 0,
  availableTags = AVAILABLE_TAGS.map((tag) => ({ ...tag, count: 0 })),
}: SearchbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const [selectedSort, setSelectedSort] = useState(sortBy);
  const [featuredOnly, setFeaturedOnly] = useState(showFeatured);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update URL with search parameters
  const updateSearch = (
    params: Record<string, string | string[] | boolean>
  ) => {
    const newParams = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(params)) {
      if (
        value === '' ||
        value === false ||
        (Array.isArray(value) && value.length === 0)
      ) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.delete(key);
        for (const v of value) {
          newParams.append(key, v);
        }
      } else {
        newParams.set(key, value.toString());
      }
    }

    startTransition(() => {
      router.push(`/blog?${newParams.toString()}`, { scroll: false });
    });
  };

  // Debounced search suggestions
  const fetchSuggestions = async (searchValue: string) => {
    if (!searchValue || searchValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSuggestionsLoading(true);
    try {
      const results = await getSearchSuggestions(searchValue, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  // Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setHighlightedIndex(-1);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce suggestions
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    // Immediate search for better UX
    updateSearch({
      q: value,
      tags: selectedTags,
      sort: selectedSort,
      featured: featuredOnly,
    });
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const searchValue =
      suggestion.type === 'title' ? suggestion.title : suggestion.text;
    setSearchQuery(searchValue);
    setShowSuggestions(false);
    updateSearch({
      q: searchValue,
      tags: selectedTags,
      sort: selectedSort,
      featured: featuredOnly,
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle tag selection
  const toggleTag = (tagValue: string) => {
    const newTags = selectedTags.includes(tagValue)
      ? selectedTags.filter((t) => t !== tagValue)
      : [...selectedTags, tagValue];

    setSelectedTags(newTags);
    updateSearch({
      q: searchQuery,
      tags: newTags,
      sort: selectedSort,
      featured: featuredOnly,
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    updateSearch({
      q: searchQuery,
      tags: selectedTags,
      sort: value,
      featured: featuredOnly,
    });
  };

  // Handle featured filter
  const handleFeaturedChange = (checked: boolean) => {
    setFeaturedOnly(checked);
    updateSearch({
      q: searchQuery,
      tags: selectedTags,
      sort: selectedSort,
      featured: checked,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedSort('date-desc');
    setFeaturedOnly(false);
    setSuggestions([]);
    setShowSuggestions(false);
    startTransition(() => {
      router.push('/blog', { scroll: false });
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasActiveFilters =
    searchQuery ||
    selectedTags.length > 0 ||
    selectedSort !== 'date-desc' ||
    featuredOnly;

  return (
    <div className="mx-auto mb-8 w-full max-w-6xl">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
          <Input
            className="h-12 border-gray-800 bg-gray-900/80 pr-12 pl-10 text-white backdrop-blur-xl placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search posts by title, description, or content..."
            ref={searchRef}
            value={searchQuery}
          />
          {(isPending || isSuggestionsLoading) && (
            <div className="-translate-y-1/2 absolute top-1/2 right-3 transform">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 mt-1 w-full rounded-lg border border-gray-800 bg-gray-900/95 shadow-xl backdrop-blur-xl"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
              ref={suggestionsRef}
              transition={{ duration: 0.2 }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  className={cn(
                    'w-full cursor-pointer border-gray-800 border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-800/50',
                    index === highlightedIndex && 'bg-gray-800/50'
                  )}
                  key={`${suggestion.slug}-${suggestion.type}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSuggestionClick(suggestion);
                    }
                  }}
                  tabIndex={0}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 flex-shrink-0 text-purple-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm text-white">
                        {suggestion.title}
                      </div>
                      {suggestion.type === 'description' && (
                        <div className="truncate text-gray-400 text-xs">
                          {suggestion.text}
                        </div>
                      )}
                    </div>
                    <Badge
                      className="border-gray-700 text-gray-400 text-xs"
                      variant="outline"
                    >
                      {suggestion.type === 'title' ? 'Title' : 'Description'}
                    </Badge>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={() => setShowFilters(!showFilters)}
          size="sm"
          variant="outline"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {(selectedTags.length > 0 || featuredOnly) && (
            <Badge
              className="ml-2 bg-purple-500/20 px-1 py-0 text-purple-400 text-xs"
              variant="secondary"
            >
              {selectedTags.length + (featuredOnly ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {/* Sort Dropdown */}
        <Select onValueChange={handleSortChange} value={selectedSort}>
          <SelectTrigger className="w-[180px] border-gray-800 bg-gray-900/80 text-white backdrop-blur-xl focus:border-purple-500/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-gray-800 bg-gray-900">
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                className="text-white hover:bg-gray-800"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            className="text-gray-400 hover:bg-gray-800 hover:text-white"
            onClick={clearFilters}
            size="sm"
            variant="ghost"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-gray-400 text-sm">
          {filteredCount !== totalPosts ? (
            <>
              Showing {filteredCount} of {totalPosts} posts
            </>
          ) : (
            <>{totalPosts} posts</>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-xl">
              {/* Tags Filter */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-sm text-white">
                    Filter by Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag.value)
                          ? 'border-purple-500/30 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                          : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                      key={tag.value}
                      onClick={() => toggleTag(tag.value)}
                      variant={
                        selectedTags.includes(tag.value) ? 'default' : 'outline'
                      }
                    >
                      {tag.label}
                      {tag.count > 0 && (
                        <span className="ml-1 text-xs opacity-75">
                          ({tag.count})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Featured Posts Filter */}
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-sm text-white">
                  Featured Posts Only
                </span>
                <Checkbox
                  checked={featuredOnly}
                  className="border-gray-700 text-purple-400 focus:ring-purple-500/20"
                  onCheckedChange={handleFeaturedChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || featuredOnly) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-gray-400 text-sm">Active filters:</span>
          {selectedTags.map((tag) => {
            const tagData = availableTags.find((t) => t.value === tag);
            const tagLabel = tagData?.label || tag;
            return (
              <Badge
                className="border-purple-500/30 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                key={tag}
                variant="secondary"
              >
                {tagLabel}
                {tagData?.count && tagData.count > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({tagData.count})
                  </span>
                )}
                <button
                  className="ml-1 hover:text-purple-300"
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {featuredOnly && (
            <Badge
              className="border-purple-500/30 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
              variant="secondary"
            >
              <Star className="mr-1 h-3 w-3" />
              Featured
              <button
                className="ml-1 hover:text-purple-300"
                onClick={() => handleFeaturedChange(false)}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
