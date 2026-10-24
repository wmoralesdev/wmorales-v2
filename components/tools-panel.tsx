"use client";

import {
  Cancel01Icon,
  Copy01Icon,
  PaintBoardIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import {
  defaultPrefs,
  PREFS_KEY,
  type PrefKey,
  type Prefs,
  prefAttr,
  prefOptions,
  TOOLS_KEY,
} from "@/lib/prefs";

function readStored(): Partial<Prefs> {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function apply(prefs: Prefs) {
  const html = document.documentElement;
  for (const key of Object.keys(prefs) as PrefKey[]) {
    html.setAttribute(prefAttr(key), prefs[key]);
  }
}

/**
 * Floating design switcher. Every change applies instantly and is saved to
 * localStorage, so a combination survives reloads while we decide what to keep.
 * Shown in development, or anywhere after visiting with ?tools (?tools=0 hides it).
 */
export function ToolsPanel() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(location.search).get("tools");
    try {
      if (param === "0") localStorage.removeItem(TOOLS_KEY);
      else if (param !== null) localStorage.setItem(TOOLS_KEY, "1");
      setEnabled(
        process.env.NODE_ENV === "development" ||
          localStorage.getItem(TOOLS_KEY) === "1",
      );
    } catch {
      setEnabled(process.env.NODE_ENV === "development" || param !== null);
    }
    setPrefs({ ...defaultPrefs, ...readStored() });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function update(patch: Partial<Prefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(prefs, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  if (!enabled) return null;

  return (
    <div className="fixed right-3 bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] z-40 flex flex-col items-end gap-2 font-sans md:right-5 md:bottom-5">
      {open && (
        <section
          aria-label="Tools de diseño"
          className="w-[min(20rem,calc(100vw-1.5rem))] origin-bottom-right animate-fade-up border border-ink/10 bg-paper p-4 text-ink shadow-[0_18px_50px_-12px_rgb(18_13_38/0.35)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-small">Tools</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="press grid size-8 place-items-center hover:bg-surface"
            >
              <Icon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {(Object.keys(prefOptions) as PrefKey[]).map((key) => {
              const group = prefOptions[key];
              return (
                <fieldset key={key}>
                  <legend className="mb-1.5 text-muted text-xs">
                    {group.label}
                  </legend>
                  <div className="flex flex-wrap gap-1">
                    {group.options.map((opt) => {
                      const active = prefs[key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            update({ [key]: opt.value } as Partial<Prefs>)
                          }
                          className={`press flex min-h-8 items-center gap-1.5 px-2.5 text-xs transition-colors ${
                            active
                              ? "bg-ink text-paper"
                              : "bg-surface text-ink hover:bg-lilac"
                          }`}
                        >
                          {"swatch" in opt && (
                            <span
                              className="size-2.5 rounded-full"
                              style={{ background: opt.swatch }}
                            />
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          <div className="mt-4 flex gap-1.5 border-ink/10 border-t pt-3">
            <button
              type="button"
              onClick={copy}
              className="press flex min-h-8 flex-1 items-center justify-center gap-1.5 bg-accent px-2.5 text-paper text-xs"
            >
              <Icon icon={Copy01Icon} size={14} />
              {copied ? "Copiado" : "Copiar selección"}
            </button>
            <button
              type="button"
              onClick={() => update(defaultPrefs)}
              className="press flex min-h-8 items-center gap-1.5 bg-surface px-2.5 text-xs hover:bg-lilac"
            >
              <Icon icon={RefreshIcon} size={14} />
              Reset
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="press group flex h-11 items-center gap-2 bg-ink px-3.5 text-paper text-small shadow-[0_10px_30px_-10px_rgb(18_13_38/0.5)]"
      >
        <Icon icon={PaintBoardIcon} size={18} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-(--ease-out) group-hover:max-w-16 group-aria-expanded:max-w-16">
          Tools
        </span>
      </button>
    </div>
  );
}
