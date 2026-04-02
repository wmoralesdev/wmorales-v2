/**
 * Short-link codes for `/r/:code` and `/api/r/:code`.
 * Add new entries here; no new route files per code.
 */
export const REDIRECT_CODES: Readonly<Record<string, string>> = {
  "tent-card-front-01": "https://cursorelsalvador.com/cafe-cursor-jet#menu",
};

export function getRedirectTarget(code: string): string | undefined {
  const key = code.trim().toLowerCase();
  return REDIRECT_CODES[key];
}
