import { cn } from "@/lib/utils";

interface SlideFrameProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Whether this slide is being rendered for print/PDF export.
   * When true, applies page-break styles.
   */
  printMode?: boolean;
}

/**
 * SlideFrame provides the 16:9 aspect ratio canvas for slides.
 * Uses CSS aspect-ratio for responsive sizing in preview,
 * and fixed dimensions in print mode for PDF export.
 */
export function SlideFrame({
  children,
  className,
  printMode = false,
}: SlideFrameProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden bg-background",
        // 16:9 aspect ratio
        printMode
          ? "h-[7.5in] w-[13.333in] shrink-0 break-inside-avoid break-after-page"
          : "aspect-video w-full",
        className,
      )}
    >
      {/* Inner content area with consistent padding */}
      <div className="flex size-full flex-col p-8 md:p-12 lg:p-16">
        {children}
      </div>
    </div>
  );
}

interface SlideCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SlideCanvas is a container for the main slide content area,
 * providing consistent spacing and flex layout.
 */
export function SlideCanvas({ children, className }: SlideCanvasProps) {
  return (
    <div className={cn("flex flex-1 flex-col justify-center", className)}>
      {children}
    </div>
  );
}
