"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptSlide } from "@/lib/slides/schema";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";
import { SlideCanvas, SlideFrame } from "../slide-frame";
import { SlideFootnote, SlideHeadline } from "../slide-typography";

interface PromptSlideViewProps {
  slide: PromptSlide;
  printMode?: boolean;
}

const styles = stylex.create({
  accent: {
    position: "absolute",
    insetInline: 0,
    top: 0,
    height: "0.25rem",
    backgroundColor: colors.accent,
  },
  canvas: {
    gap: "1.5rem",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  titleWrap: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    "@media (min-width: 768px)": {
      fontSize: "1rem",
    },
  },
  copy: {
    flexShrink: 0,
  },
  copyButton: {
    gap: "0.5rem",
  },
  prompt: {
    position: "relative",
    overflow: "hidden",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
  },
  pre: {
    maxHeight: "360px",
    overflow: "auto",
    padding: "1rem",
  },
  code: {
    whiteSpace: "pre-wrap",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    lineHeight: 1.625,
    color: `color-mix(in oklch, ${colors.foreground}, transparent 10%)`,
    "@media (min-width: 768px)": {
      fontSize: "0.875rem",
    },
  },
});

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
      <div {...stylex.props(styles.accent)} />

      <SlideCanvas className={stylex.props(styles.canvas).className}>
        <div {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.titleWrap)}>
            <SlideHeadline>{slide.headline}</SlideHeadline>
            {slide.title && (
              <p {...stylex.props(styles.title)}>{slide.title}</p>
            )}
          </div>

          {!printMode && (
            <div {...stylex.props(styles.copy)}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={stylex.props(styles.copyButton).className}
              >
                {copied ? (
                  <>
                    <Check {...stylex.props(icon.md)} />
                    <span aria-live="polite" id={toastId}>
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy {...stylex.props(icon.md)} />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div {...stylex.props(styles.prompt)}>
          <pre {...stylex.props(styles.pre)}>
            <code {...stylex.props(styles.code)}>{slide.prompt}</code>
          </pre>
        </div>

        {printMode && slide.footnote && (
          <SlideFootnote>{slide.footnote}</SlideFootnote>
        )}
      </SlideCanvas>
    </SlideFrame>
  );
}
