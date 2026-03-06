import Image from "next/image";
import type { SlideBrandMark } from "@/lib/slides/schema";
import { cn } from "@/lib/utils";

interface SlideBrandMarksProps {
  marks: SlideBrandMark[];
  className?: string;
  compact?: boolean;
}

const markSizeMap: Record<NonNullable<SlideBrandMark["size"]>, string> = {
  sm: "h-8 w-16",
  md: "h-10 w-20",
  lg: "h-12 w-28",
  xl: "h-14 w-40",
};

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
      className={cn(
        "flex flex-wrap items-end",
        compact ? "gap-3" : "gap-4",
        className,
      )}
    >
      {marks.map((mark) => {
        const sizeClass = mark.size ? markSizeMap[mark.size] : markSizeMap.lg;

        const content = (
          <>
            <div className={cn("relative shrink-0", sizeClass)}>
              {mark.lightSrc && mark.darkSrc ? (
                <>
                  <Image
                    src={mark.lightSrc}
                    alt={mark.alt}
                    fill
                    sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src={mark.darkSrc}
                    alt={mark.alt}
                    fill
                    sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                    className="hidden object-contain dark:block"
                  />
                </>
              ) : (
                <Image
                  src={mark.src}
                  alt={mark.alt}
                  fill
                  sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                  className="object-contain"
                />
              )}
            </div>
            {mark.label ? (
              <span
                className={cn(
                  "text-muted-foreground",
                  compact ? "text-[11px]" : "text-xs",
                )}
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
              className={cn(
                "flex flex-col transition-opacity hover:opacity-90",
                compact ? "gap-0.5" : "gap-1",
              )}
            >
              {content}
            </a>
          );
        }

        return (
          <div
            key={`${mark.src}-${mark.alt}`}
            className={cn("flex flex-col", compact ? "gap-0.5" : "gap-1")}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
