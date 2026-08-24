"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, ChevronDown, Copy, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Resource, ResourceCategory } from "@/lib/resources";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

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

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  tablist: {
    position: "relative",
    display: "inline-grid",
    width: "100%",
    gridAutoFlow: "column",
    gridAutoColumns: "1fr",
    alignItems: "stretch",
    borderRadius: radii.lg,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 80%)`,
    padding: "0.25rem",
  },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    left: "0.25rem",
    top: "0.25rem",
    height: "calc(100% - 0.5rem)",
    borderRadius: radii.md,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    transitionProperty: "transform",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-out",
    "@media (prefers-reduced-motion: reduce)": {
      transitionProperty: "none",
    },
  },
  tab: {
    position: "relative",
    zIndex: 10,
    borderRadius: radii.md,
    paddingInline: "0.75rem",
    paddingBlock: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 1px ${colors.ring}`,
    },
  },
  tabActive: {
    color: colors.accent,
  },
  tabInactive: {
    color: colors.mutedForeground,
    ":hover": {
      color: colors.foreground,
    },
  },
  description: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 80%)`,
    transitionProperty: "background-color, border-color",
    transitionDuration: "150ms",
  },
  header: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    padding: "0.75rem",
    textAlign: "left",
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
  },
  headerCopy: {
    minWidth: 0,
    flex: 1,
  },
  name: {
    fontWeight: 500,
    color: colors.foreground,
  },
  summary: {
    marginTop: "0.125rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  chevron: {
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    color: colors.mutedForeground,
    transitionProperty: "transform",
    transitionDuration: "150ms",
  },
  chevronOpen: {
    transform: "rotate(180deg)",
  },
  detail: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 70%)`,
    paddingInline: "0.75rem",
    paddingBottom: "0.75rem",
    paddingTop: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  pathBadge: {
    gap: "0.375rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
  },
  pathIcon: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
  actionButtons: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: "0.5rem",
  },
  copyButton: {
    gap: "0.375rem",
  },
  tinyIcon: {
    width: "0.875rem",
    height: "0.875rem",
    flexShrink: 0,
  },
  cursorLink: {
    display: "inline-flex",
    height: "2rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: colors.background,
    paddingInline: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    color: colors.foreground,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 1px ${colors.ring}`,
    },
  },
  bodyCard: {
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
  },
  bodyContent: {
    padding: "0.75rem",
  },
  pre: {
    whiteSpace: "pre-wrap",
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: `color-mix(in oklch, ${colors.foreground}, transparent 10%)`,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.375rem",
  },
  tag: {
    fontSize: "0.75rem",
  },
  examples: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  examplesTitle: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    color: colors.mutedForeground,
  },
  exampleCard: {
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 70%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 90%)`,
  },
  exampleContent: {
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
  },
  exampleText: {
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
});

export function ResourceLayout({ resources, categories }: ResourceLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>(
    categories[0] ?? "skills",
  );
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = resources.filter((r) => r.category === activeCategory);
  const activeIndex = Math.max(0, categories.indexOf(activeCategory));

  return (
    <div {...stylex.props(styles.root)}>
      <div
        role="tablist"
        aria-label="Resource categories"
        {...mergeSx(stylex.props(styles.tablist), undefined, {
          "--wm-tab-count": categories.length,
        } as CSSVars)}
      >
        <span
          aria-hidden="true"
          {...mergeSx(stylex.props(styles.indicator), undefined, {
            width: `calc((100% - 0.5rem) / var(--wm-tab-count))`,
            transform: `translateX(${activeIndex * 100}%)`,
          })}
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
            {...stylex.props(
              styles.tab,
              activeCategory === cat ? styles.tabActive : styles.tabInactive,
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <p {...stylex.props(styles.description)}>
        {CATEGORY_DESCRIPTIONS[activeCategory]}
      </p>

      <div
        id={`panel-${activeCategory}`}
        role="tabpanel"
        {...stylex.props(styles.panel)}
      >
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
    <div {...stylex.props(styles.card)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        {...stylex.props(styles.header)}
      >
        <div {...stylex.props(styles.headerCopy)}>
          <p {...stylex.props(styles.name)}>{resource.name}</p>
          <p {...stylex.props(styles.summary)}>{resource.description}</p>
        </div>
        <ChevronDown
          {...stylex.props(styles.chevron, isExpanded && styles.chevronOpen)}
        />
      </button>

      {isExpanded && (
        <div {...stylex.props(styles.detail)}>
          <div {...stylex.props(styles.actions)}>
            {resource.installPath && (
              <Badge
                variant="secondary"
                className={stylex.props(styles.pathBadge).className}
              >
                <FolderOpen {...stylex.props(styles.pathIcon)} />
                {resource.installPath}
              </Badge>
            )}
            <div {...stylex.props(styles.actionButtons)}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={stylex.props(styles.copyButton).className}
              >
                {copied ? (
                  <>
                    <Check {...stylex.props(styles.tinyIcon)} />
                    <span aria-live="polite">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy {...stylex.props(styles.tinyIcon)} />
                    Copy
                  </>
                )}
              </Button>
              <Link
                href={`https://cursor.com/link/prompt?text=${encodeURIComponent(`${resource.name}\n\n${resource.body}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                {...stylex.props(styles.cursorLink)}
              >
                Open in Cursor
              </Link>
            </div>
          </div>

          <Card className={stylex.props(styles.bodyCard).className}>
            <CardContent className={stylex.props(styles.bodyContent).className}>
              <pre {...stylex.props(styles.pre)}>{resource.body}</pre>
            </CardContent>
          </Card>

          {resource.tags && resource.tags.length > 0 && (
            <div {...stylex.props(styles.tags)}>
              {resource.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={stylex.props(styles.tag).className}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {resource.examples && resource.examples.length > 0 && (
            <div {...stylex.props(styles.examples)}>
              <h3 {...stylex.props(styles.examplesTitle)}>EXAMPLE PROMPTS</h3>
              {resource.examples.map((example) => (
                <Card
                  key={example}
                  className={stylex.props(styles.exampleCard).className}
                >
                  <CardContent
                    className={stylex.props(styles.exampleContent).className}
                  >
                    <p {...stylex.props(styles.exampleText)}>{example}</p>
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
