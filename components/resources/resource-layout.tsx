"use client";

import { Check, ChevronDown, Copy, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Resource, ResourceCategory } from "@/lib/resources";
import { cn } from "@/lib/utils";

type CSSVars = React.CSSProperties & Record<`--${string}`, number | string>;

interface ResourceLayoutProps {
  resources: Resource[];
  categories: ResourceCategory[];
}

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  skills: "Skills",
  commands: "Commands",
  rules: "Rules",
  tools: "Tools",
};

const CATEGORY_DESCRIPTIONS: Record<ResourceCategory, string> = {
  skills: "Reusable agent workflows for common tasks.",
  commands: "Custom commands to accelerate common flows.",
  rules: "Project conventions and guardrails I rely on.",
  tools: "Libraries and patterns that power this site.",
};

export function ResourceLayout({ resources, categories }: ResourceLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>(
    categories[0] ?? "skills",
  );
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = resources.filter((r) => r.category === activeCategory);
  const activeIndex = Math.max(0, categories.indexOf(activeCategory));

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div
        className="relative inline-grid w-full grid-flow-col auto-cols-fr items-stretch rounded-lg bg-muted/20 p-1"
        role="tablist"
        aria-label="Resource categories"
        style={{ "--wm-tab-count": categories.length } as CSSVars}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1 top-1 h-[calc(100%-0.5rem)] rounded-md bg-accent/20 transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{
            width: `calc((100% - 0.5rem) / var(--wm-tab-count))`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            aria-controls={`panel-${cat}`}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedSlug(null);
            }}
            className={cn(
              "relative z-10 rounded-md px-3 py-1 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              activeCategory === cat
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Category description */}
      <p className="text-sm text-muted-foreground">
        {CATEGORY_DESCRIPTIONS[activeCategory]}
      </p>

      {/* Resource list */}
      <div id={`panel-${activeCategory}`} role="tabpanel" className="space-y-2">
        {filtered.map((resource) => (
          <ResourceCard
            key={resource.slug}
            resource={resource}
            isExpanded={expandedSlug === resource.slug}
            onToggle={() =>
              setExpandedSlug(
                expandedSlug === resource.slug ? null : resource.slug,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  isExpanded,
  onToggle,
}: {
  resource: Resource;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await navigator.clipboard.writeText(resource.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [resource.body],
  );

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 transition-colors">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 p-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{resource.name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {resource.description}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-border/30 px-3 pb-3 pt-3 space-y-4">
          {/* Actions + install path row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {resource.installPath && (
              <Badge variant="secondary" className="gap-1.5 font-mono text-xs">
                <FolderOpen className="size-3" />
                {resource.installPath}
              </Badge>
            )}
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    <span aria-live="polite">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Link
                href={`https://cursor.com/link/prompt?text=${encodeURIComponent(`${resource.name}\n\n${resource.body}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                Open in Cursor
              </Link>
            </div>
          </div>

          {/* Body */}
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-3">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                {resource.body}
              </pre>
            </CardContent>
          </Card>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Example prompts */}
          {resource.examples && resource.examples.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">
                EXAMPLE PROMPTS
              </h3>
              {resource.examples.map((example) => (
                <Card key={example} className="border-border/30 bg-muted/10">
                  <CardContent className="px-3 py-2">
                    <p className="font-mono text-sm text-muted-foreground">
                      {example}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
