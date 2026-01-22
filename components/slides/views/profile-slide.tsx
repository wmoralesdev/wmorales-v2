import Image from "next/image";
import type { ProfileSlide } from "@/lib/slides/schema";
import { SlideCredentials } from "../slide-credentials";
import { SlideCanvas, SlideFrame } from "../slide-frame";
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
        <div className="flex gap-8 md:gap-12">
          {/* Image (if present) */}
          {slide.image && (
            <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl ring-2 ring-accent/30 ring-offset-2 ring-offset-background md:w-40 lg:w-48">
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <SlideHeadline className="text-3xl md:text-4xl lg:text-5xl">
                {slide.headline}
              </SlideHeadline>
              <SlideSubline className="text-lg md:text-xl">
                {slide.subtitle}
              </SlideSubline>
            </div>

            {/* Bio */}
            <SlideBody className="text-base md:text-lg">{slide.bio}</SlideBody>

            {/* Credentials */}
            {slide.credentials.length > 0 && (
              <SlideCredentials credentials={slide.credentials} />
            )}
          </div>
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
