import QRCode from "react-qr-code";
import type { CtaSlide } from "@/lib/slides/schema";
import { SlideContact } from "../slide-contact";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideNumberedSteps } from "../slide-list";
import { SlideVisibleResources } from "../slide-visible-resources";
import { SlideHeadline } from "../slide-typography";

interface CtaSlideViewProps {
  slide: CtaSlide;
  printMode?: boolean;
}

/**
 * CtaSlideView renders a call-to-action with steps, contact info, and optional QR.
 */
export function CtaSlideView({ slide, printMode = false }: CtaSlideViewProps) {
  return (
    <SlideFrame printMode={printMode}>
      {/* Accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

      <SlideCanvas className="space-y-6">
        <SlideHeadline multiline>{slide.headline}</SlideHeadline>

        <div className="flex gap-6 md:gap-8">
          {/* Steps and contact */}
          <div className="flex-1 space-y-5">
            <SlideNumberedSteps steps={slide.steps} className="space-y-3" />
            <SlideContact contact={slide.contact} compact />
          </div>

          {(slide.qr || (slide.visibleResources && slide.visibleResources.length > 0)) && (
            <div className="flex w-44 shrink-0 flex-col items-center gap-3">
              {slide.qr && (
                <div className="overflow-hidden rounded-xl border-2 border-accent/30 bg-white p-4 shadow-lg shadow-accent/10">
                  <QRCode
                    value={slide.qr.url}
                    size={112}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              )}
              {slide.qr && (
                <p className="max-w-[160px] truncate text-center text-xs text-muted-foreground">
                  {slide.qr.label ?? slide.qr.url}
                </p>
              )}
              {slide.visibleResources && slide.visibleResources.length > 0 && (
                <SlideVisibleResources
                  resources={slide.visibleResources}
                  title="Mantengamos el contacto"
                  compact
                  className="w-full"
                />
              )}
            </div>
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
