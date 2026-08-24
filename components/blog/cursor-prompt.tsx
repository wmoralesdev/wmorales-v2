"use client";

import * as stylex from "@stylexjs/stylex";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { icon } from "@/lib/stylex/icons";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

// Cursor brand colors
const CURSOR_COLORS = {
  light: { bg: "#f7f7f4", fg: "#26251e" },
  dark: { bg: "#26251e", fg: "#f7f7f4" },
};

// Cursor cube SVG path
const CURSOR_CUBE_PATH =
  "M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z";

const collapsibleDown = stylex.keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-collapsible-content-height)" },
});

const collapsibleUp = stylex.keyframes({
  from: { height: "var(--radix-collapsible-content-height)" },
  to: { height: 0 },
});

const styles = stylex.create({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    height: "2rem",
    borderRadius: radii.md,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    paddingInline: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecorationLine: "none",
    textDecorationColor: "transparent",
    transitionProperty: "color, background-color, border-color, transform",
    transitionDuration: "150ms",
    ":active": {
      transform: "scale(0.95)",
    },
  },
  logoWrap: {
    position: "relative",
    flexShrink: 0,
    width: 14,
    height: 14,
  },
  logoLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    transitionProperty: "opacity",
    transitionDuration: "150ms",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    objectFit: "cover",
    margin: 0,
    padding: 0,
    borderWidth: 0,
    pointerEvents: "none",
    transitionProperty: "opacity",
    transitionDuration: "150ms",
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  root: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.accent}, transparent 70%)`,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 95%)`,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
    paddingInline: "1rem",
    paddingBlock: "0.75rem",
  },
  title: {
    minWidth: 0,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: fonts.display,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  trigger: {
    flexShrink: 0,
    borderRadius: radii.sm,
    padding: "0.25rem",
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    },
  },
  chevron: {
    color: colors.mutedForeground,
    transitionProperty: "transform",
    transitionDuration: "200ms",
  },
  chevronOpen: {
    transform: "rotate(180deg)",
  },
  content: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    ':is([data-state="closed"])': {
      animationName: collapsibleUp,
      animationDuration: "200ms",
      animationTimingFunction: "ease-out",
    },
    ':is([data-state="open"])': {
      animationName: collapsibleDown,
      animationDuration: "200ms",
      animationTimingFunction: "ease-out",
    },
  },
  promptWrap: {
    padding: "1rem",
  },
  prompt: {
    whiteSpace: "pre-wrap",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    fontFamily: fonts.mono,
    lineHeight: 1.625,
  },
});

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
  const themeColors = isDark ? CURSOR_COLORS.dark : CURSOR_COLORS.light;
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

  const bgColor = mounted ? themeColors.bg : CURSOR_COLORS.dark.bg;
  const fgColor = mounted ? themeColors.fg : CURSOR_COLORS.dark.fg;
  const showVideo = isHovering || isPlaying;

  return (
    <a
      href={deepLink}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
      {...mergeSx(stylex.props(styles.button), undefined, {
        backgroundColor: bgColor,
        color: fgColor,
        textDecoration: "none",
      })}
    >
      <div {...stylex.props(styles.logoWrap)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 466.73 532.09"
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          {...stylex.props(
            styles.logoLayer,
            showVideo ? styles.hidden : styles.visible,
          )}
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
          {...stylex.props(
            styles.video,
            showVideo ? styles.visible : styles.hidden,
          )}
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
      className={stylex.props(styles.root).className}
    >
      <div {...stylex.props(styles.header)}>
        <span {...stylex.props(styles.title)}>{title}</span>
        <CursorPromptButton deepLink={deepLink} />
        <CollapsibleTrigger className={stylex.props(styles.trigger).className}>
          <ChevronDown
            {...stylex.props(
              icon.md,
              styles.chevron,
              isOpen && styles.chevronOpen,
            )}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={stylex.props(styles.content).className}>
        <div {...stylex.props(styles.promptWrap)}>
          <pre {...stylex.props(styles.prompt)}>{prompt}</pre>
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

      // Decode the base64 prompt (must use TextDecoder for proper UTF-8)
      let prompt = "";
      try {
        const binaryString = atob(promptBase64);
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
        prompt = new TextDecoder("utf-8").decode(bytes);
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
