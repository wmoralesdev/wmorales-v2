import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import type { SlideBrandMark } from "@/lib/slides/schema";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

interface SlideBrandMarksProps {
  marks: SlideBrandMark[];
  className?: string;
  compact?: boolean;
}

const styles = stylex.create({
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: "1rem",
  },
  listCompact: {
    gap: "0.75rem",
  },
  mark: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  markCompact: {
    gap: "0.125rem",
  },
  markLink: {
    transitionProperty: "opacity",
    transitionDuration: "150ms",
    ":hover": {
      opacity: 0.9,
    },
  },
  imageWrap: {
    position: "relative",
    flexShrink: 0,
  },
  sizeSm: {
    height: "2rem",
    width: "4rem",
  },
  sizeMd: {
    height: "2.5rem",
    width: "5rem",
  },
  sizeLg: {
    height: "3rem",
    width: "7rem",
  },
  sizeXl: {
    height: "3.5rem",
    width: "10rem",
  },
  image: {
    objectFit: "contain",
  },
  lightOnly: {
    objectFit: "contain",
    display: "block",
    ":is(.dark *)": {
      display: "none",
    },
  },
  darkOnly: {
    objectFit: "contain",
    display: "none",
    ":is(.dark *)": {
      display: "block",
    },
  },
  label: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
  },
  labelCompact: {
    fontSize: "0.6875rem",
  },
});

const sizeStyles = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
} as const;

/**
 * SlideBrandMarks renders one or more inline brand marks or lockups.
 */
export function SlideBrandMarks({
  marks,
  className,
  compact = false,
}: SlideBrandMarksProps) {
  if (marks.length === 0) return null;

  return (
    <div
      {...mergeSx(
        stylex.props(styles.list, compact && styles.listCompact),
        className,
      )}
    >
      {marks.map((mark) => {
        const sizeStyle = mark.size ? sizeStyles[mark.size] : sizeStyles.lg;

        const content = (
          <>
            <div {...stylex.props(styles.imageWrap, sizeStyle)}>
              {mark.lightSrc && mark.darkSrc ? (
                <>
                  <Image
                    src={mark.lightSrc}
                    alt={mark.alt}
                    fill
                    sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                    {...stylex.props(styles.lightOnly)}
                  />
                  <Image
                    src={mark.darkSrc}
                    alt={mark.alt}
                    fill
                    sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                    {...stylex.props(styles.darkOnly)}
                  />
                </>
              ) : (
                <Image
                  src={mark.src}
                  alt={mark.alt}
                  fill
                  sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                  {...stylex.props(styles.image)}
                />
              )}
            </div>
            {mark.label ? (
              <span
                {...stylex.props(styles.label, compact && styles.labelCompact)}
              >
                {mark.label}
              </span>
            ) : null}
          </>
        );

        if (mark.href) {
          return (
            <a
              key={`${mark.src}-${mark.alt}`}
              href={mark.href}
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(
                styles.mark,
                compact && styles.markCompact,
                styles.markLink,
              )}
            >
              {content}
            </a>
          );
        }

        return (
          <div
            key={`${mark.src}-${mark.alt}`}
            {...stylex.props(styles.mark, compact && styles.markCompact)}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
