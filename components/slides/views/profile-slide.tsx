import Image from "next/image";
import type { ProfileSlide } from "@/lib/slides/schema";
import { SlideBrandMarks } from "../slide-brand-marks";
import { SlideChipList } from "../slide-chip-list";
import { SlideCredentials } from "../slide-credentials";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideVisibleResources } from "../slide-visible-resources";
import { SlideBody, SlideHeadline, SlideSubline } from "../slide-typography";

interface ProfileSlideViewProps {
  slide: ProfileSlide;
  printMode?: boolean;
}

/**
 * ProfileSlideView renders a personal/bio slide with credentials.
 */
export function ProfileSlideView({
  slide,
  printMode = false,
}: ProfileSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      <SlideCanvas>
        <div className="flex gap-5 md:gap-8">
          {/* Image (if present) */}
          {slide.image && (
            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl ring-2 ring-accent/30 ring-offset-2 ring-offset-background md:w-28 lg:w-36">
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                sizes="(max-width: 768px) 6rem, (max-width: 1024px) 7rem, 9rem"
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col space-y-4">
            {/* Header */}
            <div className="space-y-1.5">
              <SlideHeadline className="text-2xl md:text-3xl lg:text-4xl">
                {slide.headline}
              </SlideHeadline>
              <SlideSubline className="text-base md:text-lg">
                {slide.subtitle}
              </SlideSubline>
            </div>

            {slide.chips && slide.chips.length > 0 && (
              <SlideChipList chips={slide.chips} />
            )}

            {/* Bio */}
            <SlideBody className="text-sm md:text-base">{slide.bio}</SlideBody>

            {slide.brandMarks && slide.brandMarks.length > 0 && (
              <SlideBrandMarks marks={slide.brandMarks} compact />
            )}

            {/* Credentials */}
            {slide.credentials.length > 0 && (
              <SlideCredentials
                credentials={slide.credentials}
                className="gap-4"
              />
            )}

            {slide.visibleResources && slide.visibleResources.length > 0 && (
              <SlideVisibleResources
                resources={slide.visibleResources}
                title="Enlaces"
                compact
              />
            )}
          </div>
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
