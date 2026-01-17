"use client";

import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Cursor brand colors
const CURSOR_COLORS = {
  light: { bg: "#f7f7f4", fg: "#26251e" },
  dark: { bg: "#26251e", fg: "#f7f7f4" },
};

// Cursor cube SVG path
const CURSOR_CUBE_PATH =
  "M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z";

type CursorPromptButtonProps = {
  deepLink: string;
};

function CursorPromptButton({ deepLink }: CursorPromptButtonProps) {
  const { resolvedTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? CURSOR_COLORS.dark : CURSOR_COLORS.light;
  const videoSrc = isDark ? "/logo-dark-theme.mp4" : "/logo-light-theme.mp4";

  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const LOOP_DELAY_MS = 500;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.loop = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  };

  const handleVideoEnded = () => {
    if (isHovering && videoRef.current) {
      loopTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && isHovering) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }, LOOP_DELAY_MS);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  const bgColor = mounted ? colors.bg : CURSOR_COLORS.dark.bg;
  const fgColor = mounted ? colors.fg : CURSOR_COLORS.dark.fg;

  return (
    <a
      href={deepLink}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-8 rounded-md shadow-xs px-3 text-sm font-medium",
        "transition-all active:scale-95 no-underline! decoration-transparent!",
      )}
      style={{ backgroundColor: bgColor, color: fgColor }}
    >
      <div
        className="shrink-0"
        style={{
          position: "relative",
          width: "14px",
          height: "14px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 466.73 532.09"
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "transition-opacity duration-150",
            isHovering || isPlaying ? "opacity-0" : "opacity-100",
          )}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "14px",
            height: "14px",
          }}
        >
          <path d={CURSOR_CUBE_PATH} />
        </svg>

        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          className={cn(
            "pointer-events-none transition-opacity duration-150",
            isHovering || isPlaying ? "opacity-100" : "opacity-0",
          )}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "14px",
            height: "14px",
            objectFit: "cover",
            margin: 0,
            padding: 0,
            border: "none",
          }}
        />
      </div>
      Open in Cursor
    </a>
  );
}

type CursorPromptProps = {
  title: string;
  prompt: string;
  deepLink: string;
};

function CursorPrompt({ title, prompt, deepLink }: CursorPromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border border-accent/30 bg-accent/5 overflow-hidden"
    >
      <div className="flex items-center gap-3 bg-accent/10 px-4 py-3">
        <span className="min-w-0 flex-1 truncate font-display text-sm font-medium text-foreground">
          {title}
        </span>
        <CursorPromptButton deepLink={deepLink} />
        <CollapsibleTrigger className="shrink-0 rounded p-1 transition-colors hover:bg-accent/20 cursor-pointer">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="border-t border-accent/20 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="p-4">
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed">
            {prompt}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

type PromptPlaceholder = {
  element: HTMLElement;
  title: string;
  prompt: string;
  deepLink: string;
};

export function CursorPrompts() {
  const [placeholders, setPlaceholders] = useState<PromptPlaceholder[]>([]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      "[data-cursor-prompt]",
    );

    const found: PromptPlaceholder[] = [];
    for (const el of elements) {
      const title = el.dataset.title || "";
      const promptBase64 = el.dataset.prompt || "";
      const deepLink = el.dataset.deeplink || "";

      // Decode the base64 prompt
      let prompt = "";
      try {
        prompt = atob(promptBase64);
      } catch {
        prompt = promptBase64;
      }

      if (title && prompt) {
        found.push({ element: el, title, prompt, deepLink });
      }
    }

    setPlaceholders(found);
  }, []);

  return (
    <>
      {placeholders.map((placeholder, index) =>
        createPortal(
          <CursorPrompt
            title={placeholder.title}
            prompt={placeholder.prompt}
            deepLink={placeholder.deepLink}
          />,
          placeholder.element,
          `cursor-prompt-${index}`,
        ),
      )}
    </>
  );
}
