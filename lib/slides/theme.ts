import type { PresentationMeta } from "./schema";

// =============================================================================
// Theme token definitions
// =============================================================================

/**
 * Light mode base tokens (from globals.css :root)
 */
const LIGHT_TOKENS = {
  "--background": "oklch(0.985 0.002 280)",
  "--foreground": "oklch(0.15 0.01 280)",
  "--muted": "oklch(0.94 0.005 280)",
  "--muted-foreground": "oklch(0.45 0.02 280)",
  "--border": "oklch(0.88 0.01 280)",
  "--ring": "oklch(0.55 0.25 280)",
} as const;

/**
 * Dark mode base tokens (from globals.css .dark)
 */
const DARK_TOKENS = {
  "--background": "oklch(0.08 0.008 280)",
  "--foreground": "oklch(0.95 0.005 280)",
  "--muted": "oklch(0.15 0.01 280)",
  "--muted-foreground": "oklch(0.7 0.015 280)",
  "--border": "oklch(0.22 0.015 280)",
  "--ring": "oklch(0.72 0.2 280)",
} as const;

// =============================================================================
// Utility functions
// =============================================================================

/**
 * Convert a hex color to RGB values.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color.
 * Used to determine if accent-foreground should be black or white.
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine the best foreground color (black or white) for a given background.
 */
function getContrastingForeground(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return "oklch(0.98 0 0)"; // Default to white-ish
  }

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // WCAG recommends 0.179 as threshold, but 0.5 works better for accent colors
  return luminance > 0.5 ? "oklch(0.15 0.01 280)" : "oklch(0.98 0 0)";
}

/**
 * Convert hex color to an oklch-ish approximation for CSS variable.
 * For simplicity, we use the hex directly since CSS can handle it.
 */
function hexToAccentVar(hex: string): string {
  // We can use the hex color directly in CSS
  return hex;
}

// =============================================================================
// Theme generation
// =============================================================================

export type SlideThemeTokens = Record<string, string>;

/**
 * Generate CSS variable tokens for a presentation based on its meta.
 */
export function generateSlideTheme(meta: PresentationMeta): SlideThemeTokens {
  const baseTokens = meta.theme === "dark" ? DARK_TOKENS : LIGHT_TOKENS;

  return {
    ...baseTokens,
    "--accent": hexToAccentVar(meta.accentColor),
    "--accent-foreground": getContrastingForeground(meta.accentColor),
  };
}

/**
 * Convert theme tokens to a CSS style string for inline styles.
 */
export function themeTokensToStyle(tokens: SlideThemeTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

/**
 * Convert theme tokens to a React CSSProperties object.
 */
export function themeTokensToCSSProperties(
  tokens: SlideThemeTokens,
): React.CSSProperties {
  const properties: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    properties[key] = value;
  }
  return properties as React.CSSProperties;
}
