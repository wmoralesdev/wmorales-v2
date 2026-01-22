import QRCode from "react-qr-code";
import type { CtaSlide } from "@/lib/slides/schema";
import { SlideContact } from "../slide-contact";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideNumberedSteps } from "../slide-list";
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

      <SlideCanvas className="space-y-8">
        <SlideHeadline multiline>{slide.headline}</SlideHeadline>

        <div className="flex gap-8 md:gap-12">
          {/* Steps and contact */}
          <div className="flex-1 space-y-8">
            <SlideNumberedSteps steps={slide.steps} />
            <SlideContact contact={slide.contact} />
          </div>

          {/* QR Code */}
          {slide.qr && (
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="overflow-hidden rounded-xl border-2 border-accent/30 bg-white p-4 shadow-lg shadow-accent/10">
                <QRCode
                  value={slide.qr}
                  size={140}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="max-w-[160px] truncate text-center text-xs text-muted-foreground">
                {slide.qr}
              </p>
            </div>
          )}
        </div>
      </SlideCanvas>
    </SlideFrame>
  );
}
