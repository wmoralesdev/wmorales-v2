export type ThemePref = "system" | "light" | "dark";

export const THEME_KEY = "wm-theme";

/**
 * Runs inline in <head> before first paint, so a dark visitor never sees a flash
 * of the light page. Keep it tiny and dependency-free.
 */
export const themeScript = `(()=>{try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

/** Resolves the preference and paints it on <html>. */
export function applyPref(pref: ThemePref) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  const dark =
    pref === "dark" ||
    (pref === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

/** Calls `fn` whenever the painted theme changes, e.g. so a canvas can redraw. */
export function onThemeChange(fn: () => void) {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => mo.disconnect();
}
