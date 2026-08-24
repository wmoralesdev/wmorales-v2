"use client";

import * as stylex from "@stylexjs/stylex";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

interface LandscapeEnforcerProps {
  children: React.ReactNode;
}

const pulse = stylex.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
});

const styles = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    backgroundColor: colors.background,
    padding: "2rem",
    textAlign: "center",
  },
  pulse: {
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
    animationIterationCount: "infinite",
  },
  icon: {
    width: "4rem",
    height: "4rem",
    color: colors.accent,
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  body: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  hidden: {
    display: "none",
  },
});

/**
 * LandscapeEnforcer attempts to lock orientation to landscape on mobile
 * and shows a rotate prompt if the device is in portrait mode.
 */
export function LandscapeEnforcer({ children }: LandscapeEnforcerProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 1024px)").matches;
      setIsMobile(mobile);
    };

    const checkOrientation = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setIsPortrait(portrait);
    };

    const tryLockOrientation = async () => {
      try {
        // @ts-expect-error - Screen Orientation API types
        if (screen.orientation?.lock) {
          // @ts-expect-error - Screen Orientation API
          await screen.orientation.lock("landscape");
        }
      } catch {
        // Orientation lock not supported or not in fullscreen - that's okay
      }
    };

    checkMobile();
    checkOrientation();
    tryLockOrientation();

    const portraitQuery = window.matchMedia("(orientation: portrait)");
    const mobileQuery = window.matchMedia("(max-width: 1024px)");

    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    portraitQuery.addEventListener("change", handleOrientationChange);
    mobileQuery.addEventListener("change", handleMobileChange);

    return () => {
      portraitQuery.removeEventListener("change", handleOrientationChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  const showRotatePrompt = isMobile && isPortrait;

  return (
    <>
      {showRotatePrompt && (
        <div {...stylex.props(styles.overlay)}>
          <div {...stylex.props(styles.pulse)}>
            <RotateCcw {...stylex.props(styles.icon)} />
          </div>
          <div {...stylex.props(styles.copy)}>
            <h2 {...stylex.props(styles.title)}>Rotate Your Device</h2>
            <p {...stylex.props(styles.body)}>
              This presentation is best viewed in landscape mode.
              <br />
              Please rotate your device horizontally.
            </p>
          </div>
        </div>
      )}
      <div {...stylex.props(showRotatePrompt && styles.hidden)}>{children}</div>
    </>
  );
}
