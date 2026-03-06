import { cn } from "@/lib/utils";

interface SlideChipListProps {
  chips: string[];
  className?: string;
}

/**
 * SlideChipList renders compact topic or audience chips within a slide.
 */
export function SlideChipList({ chips, className }: SlideChipListProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent md:text-sm"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
