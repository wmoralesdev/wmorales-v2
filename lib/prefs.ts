// Design switches for the Tools panel. Each pref becomes a data attribute on
// <html> (data-font, data-case, ...) and globals.css maps it to tokens, so the
// whole site restyles without React re-rendering anything.

export const PREFS_KEY = "wm-prefs";
export const TOOLS_KEY = "wm-tools";

export const prefOptions = {
  font: {
    label: "Fuente",
    options: [
      { value: "jakarta", label: "Jakarta" },
      { value: "helvetica", label: "Helvetica Neue" },
    ],
  },
  case: {
    label: "Titulares",
    options: [
      { value: "normal", label: "Normal" },
      { value: "upper", label: "Mayúsculas" },
    ],
  },
  weight: {
    label: "Peso",
    options: [
      { value: "600", label: "600" },
      { value: "700", label: "700" },
      { value: "800", label: "800" },
    ],
  },
  scale: {
    label: "Escala",
    options: [
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
    ],
  },
  accent: {
    label: "Acento",
    options: [
      { value: "violet", label: "Violeta", swatch: "#614afc" },
      { value: "cobalt", label: "Cobalto", swatch: "#2551f0" },
      { value: "orange", label: "Naranja", swatch: "#c2410c" },
      { value: "green", label: "Verde", swatch: "#047857" },
    ],
  },
  ht: {
    label: "Halftone",
    options: [
      { value: "fluid", label: "Fluido" },
      { value: "waves", label: "Ondas" },
      { value: "off", label: "Off" },
    ],
  },
  htSize: {
    label: "Puntos",
    options: [
      { value: "fine", label: "Finos" },
      { value: "medium", label: "Medios" },
    ],
  },
} as const;

export type PrefKey = keyof typeof prefOptions;
export type Prefs = {
  [K in PrefKey]: (typeof prefOptions)[K]["options"][number]["value"];
};

export const defaultPrefs: Prefs = {
  font: "jakarta",
  case: "normal",
  weight: "700",
  scale: "m",
  accent: "violet",
  ht: "fluid",
  htSize: "fine",
};

/** data-* attribute name for a pref (htSize -> data-ht-size). */
export const prefAttr = (key: PrefKey) =>
  `data-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

/**
 * Runs in <head> before first paint so saved prefs never flash the defaults.
 * Kept dependency-free and tolerant of blocked storage.
 */
export const prefsScript = `(function(){try{var d=${JSON.stringify(defaultPrefs)},s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_KEY)})||"{}"),h=document.documentElement;for(var k in d){var v=s[k]||d[k];h.setAttribute("data-"+k.replace(/[A-Z]/g,function(c){return"-"+c.toLowerCase()}),v)}}catch(e){}})();`;
