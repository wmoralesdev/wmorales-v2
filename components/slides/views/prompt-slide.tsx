"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptSlide } from "@/lib/slides/schema";
import { cn } from "@/lib/utils";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface PromptSlideViewProps {
  slide: PromptSlide;
  printMode?: boolean;
}

export function PromptSlideView({
  slide,
  printMode = false,
}: PromptSlideViewProps) {
  const [copied, setCopied] = useState(false);
  const toastId = useId();

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(slide.prompt);
    setCopied(true);
  }, [slide.prompt]);

  return (
    <SlideFrame printMode={printMode}>
      {/* Accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

      <SlideCanvas className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 space-y-2">
            <SlideHeadline>{slide.headline}</SlideHeadline>
            {slide.title && (
              <p className="text-sm text-muted-foreground md:text-base">
                {slide.title}
              </p>
            )}
          </div>

          {!printMode && (
            <div className="shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    <span aria-live="polite" id={toastId}>
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-border/60 bg-muted/30",
            "shadow-sm",
          )}
        >
          <pre className="max-h-[360px] overflow-auto p-4">
            <code className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90 md:text-sm">
              {slide.prompt}
            </code>
          </pre>
        </div>

        {slide.footnote && <SlideFootnote>{slide.footnote}</SlideFootnote>}
      </SlideCanvas>
    </SlideFrame>
  );
}
