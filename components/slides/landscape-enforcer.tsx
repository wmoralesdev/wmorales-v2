"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface LandscapeEnforcerProps {
  children: React.ReactNode;
}

/**
 * LandscapeEnforcer attempts to lock orientation to landscape on mobile
 * and shows a rotate prompt if the device is in portrait mode.
 */
export function LandscapeEnforcer({ children }: LandscapeEnforcerProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 1024px)").matches;
      setIsMobile(mobile);
    };

    // Check orientation
    const checkOrientation = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setIsPortrait(portrait);
    };

    // Try to lock orientation to landscape (requires fullscreen on most browsers)
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

    // Listen for changes
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

  // Show rotate prompt only on mobile in portrait
  const showRotatePrompt = isMobile && isPortrait;

  return (
    <>
      {showRotatePrompt && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background p-8 text-center">
          <div className="animate-pulse">
            <RotateCcw className="size-16 text-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Rotate Your Device
            </h2>
            <p className="text-sm text-muted-foreground">
              This presentation is best viewed in landscape mode.
              <br />
              Please rotate your device horizontally.
            </p>
          </div>
        </div>
      )}
      <div className={showRotatePrompt ? "hidden" : undefined}>{children}</div>
    </>
  );
}
