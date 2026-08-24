import * as stylex from "@stylexjs/stylex";
import {
  CalendarRange,
  ExternalLink,
  Images,
  Link2,
  MessageCircleMore,
} from "lucide-react";
import type { SlideVisibleResource } from "@/lib/slides/schema";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

interface SlideVisibleResourcesProps {
  resources: SlideVisibleResource[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const iconMap = {
  default: Link2,
  event: CalendarRange,
  photos: Images,
  community: MessageCircleMore,
} as const;

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  rootCompact: {
    gap: "0.5rem",
  },
  title: {
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: colors.mutedForeground,
    fontSize: "0.75rem",
  },
  titleCompact: {
    fontSize: "0.625rem",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.625rem",
  },
  listCompact: {
    gap: "0.5rem",
  },
  link: {
    display: "inline-flex",
    maxWidth: "100%",
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 30%)`,
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 40%)`,
    color: `color-mix(in oklch, ${colors.foreground}, transparent 10%)`,
    gap: "0.5rem",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: "0.75rem",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 60%)`,
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 95%)`,
      color: colors.accent,
    },
    "@media (min-width: 768px)": {
      fontSize: "0.875rem",
    },
  },
  linkCompact: {
    gap: "0.375rem",
    paddingInline: "0.625rem",
    paddingBlock: "0.375rem",
    fontSize: "0.6875rem",
  },
  icon: {
    width: "0.875rem",
    height: "0.875rem",
    flexShrink: 0,
  },
  iconCompact: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  external: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
    opacity: 0.6,
  },
  externalCompact: {
    width: "0.625rem",
    height: "0.625rem",
    flexShrink: 0,
    opacity: 0.6,
  },
});

/**
 * SlideVisibleResources renders important links directly inside slides.
 */
export function SlideVisibleResources({
  resources,
  title,
  className,
  compact = false,
}: SlideVisibleResourcesProps) {
  if (resources.length === 0) return null;

  return (
    <div
      {...mergeSx(
        stylex.props(styles.root, compact && styles.rootCompact),
        className,
      )}
    >
      {title ? (
        <p {...stylex.props(styles.title, compact && styles.titleCompact)}>
          {title}
        </p>
      ) : null}

      <div {...stylex.props(styles.list, compact && styles.listCompact)}>
        {resources.map((resource) => {
          const Icon = iconMap[resource.kind ?? "default"] ?? Link2;

          return (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.link, compact && styles.linkCompact)}
            >
              <Icon
                {...stylex.props(compact ? styles.iconCompact : styles.icon)}
              />
              <span {...stylex.props(styles.label)}>{resource.label}</span>
              <ExternalLink
                {...stylex.props(
                  compact ? styles.externalCompact : styles.external,
                )}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
