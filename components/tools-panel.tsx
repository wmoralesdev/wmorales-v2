"use client";

import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ComputerIcon,
  Home01Icon,
  IdCardIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HalftoneIcon } from "@/components/halftone-icon";
import { Icon } from "@/components/icon";
import { LangLink } from "@/components/lang-link";
import {
  type Locale,
  locales,
  matchRoute,
  path,
  type RouteKey,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { applyPref, readPref, type ThemePref } from "@/lib/theme";

/** Add an entry here to add a shortcut. */
const shortcuts: { key: "home" | "book" | "intro"; icon: typeof Home01Icon }[] =
  [
    { key: "home", icon: Home01Icon },
    { key: "book", icon: Calendar03Icon },
    { key: "intro", icon: IdCardIcon },
  ];

const themes: { value: ThemePref; icon: typeof Sun03Icon }[] = [
  { value: "light", icon: Sun03Icon },
  { value: "dark", icon: Moon02Icon },
  { value: "system", icon: ComputerIcon },
];

// Each language names itself, so the switch reads right from either side.
const languageNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

/**
 * Floating Tools button on every page: the theme and language switches plus quick
 * links to the booking page and the intro card.
 */
export function ToolsPanel({
  lang,
  t,
}: {
  lang: Locale;
  t: Dictionary["tools"];
}) {
  const pathname = usePathname();
  // The proxy rewrites Spanish URLs onto /es/..., so the public URL is only known
  // in the browser. Read it after mount; the panel opens later anyway.
  const [here, setHere] = useState<RouteKey | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-read on every route change.
  useEffect(() => {
    setHere(matchRoute(window.location.pathname)?.key ?? null);
  }, [pathname]);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePref>("system");

  // The stored choice is only readable after hydration.
  useEffect(() => setTheme(readPref()), []);

  // While following the system, track it live.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyPref("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  // Close on Escape, on a click outside, and after following a shortcut.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  function pick(value: ThemePref) {
    setTheme(value);
    applyPref(value);
  }

  const links = shortcuts.filter((s) => s.key !== here);
  // On /intro's phone layout the button shares a row with the action bar.
  // Matches both the public URL and the rewritten one.
  const place = pathname.endsWith("/intro")
    ? "bottom-[max(0.75rem,env(safe-area-inset-bottom))] lg:bottom-5"
    : "bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] md:bottom-5";

  return (
    <div
      ref={rootRef}
      className={`fixed right-3 z-40 flex flex-col items-end gap-2 font-sans md:right-5 ${place}`}
    >
      {open && (
        <section
          aria-label={t.title}
          className="w-[min(18rem,calc(100vw-1.5rem))] origin-bottom-right animate-fade-up border border-ink/10 bg-paper p-4 text-ink shadow-[0_18px_50px_-12px_rgb(18_13_38/0.35)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-small">{t.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="press grid size-8 place-items-center hover:bg-surface"
            >
              <Icon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-muted text-small">{t.theme}</legend>
            <div className="grid grid-cols-3 gap-1 bg-surface p-1">
              {themes.map((th) => (
                <label
                  key={th.value}
                  className={`press flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 font-semibold text-[0.75rem] transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                    theme === th.value
                      ? "bg-ink text-paper"
                      : "text-ink hover:bg-paper"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={th.value}
                    checked={theme === th.value}
                    onChange={() => pick(th.value)}
                    className="sr-only"
                  />
                  <Icon icon={th.icon} size={16} />
                  {t.themes[th.value]}
                </label>
              ))}
            </div>
          </fieldset>

          <nav aria-label={t.language} className="mt-4">
            <p className="mb-1.5 text-muted text-small">{t.language}</p>
            <div className="grid grid-cols-2 gap-1 bg-surface p-1">
              {locales.map((l) =>
                l === lang ? (
                  <span
                    key={l}
                    aria-current="true"
                    className="flex min-h-10 items-center justify-center bg-ink font-semibold text-[0.75rem] text-paper"
                  >
                    {languageNames[l]}
                  </span>
                ) : (
                  <LangLink
                    key={l}
                    lang={l}
                    href={path(l, here ?? "home")}
                    className="press flex min-h-10 items-center justify-center font-semibold text-[0.75rem] text-ink transition-colors duration-200 hover:bg-paper"
                  >
                    {languageNames[l]}
                  </LangLink>
                ),
              )}
            </div>
          </nav>

          {links.length > 0 && (
            <nav aria-label={t.shortcuts} className="mt-4 space-y-1">
              {links.map((s) => (
                <Link
                  key={s.key}
                  href={path(lang, s.key)}
                  className="press group/link flex min-h-10 items-center gap-2.5 bg-surface px-3 text-small transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon icon={s.icon} size={18} />
                  <span className="flex-1">{t[s.key]}</span>
                  <Icon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    className="opacity-50 transition-opacity group-hover/link:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t.title}
        data-icon-hover
        className="press grid size-14 place-items-center bg-ink shadow-[0_10px_30px_-10px_rgb(18_13_38/0.5)]"
      >
        {/* A grid of tiles for "menu"; it turns into a cross while the panel is open. */}
        <HalftoneIcon
          shape={open ? "plus" : "tiles"}
          motion="hover"
          className={`size-8 text-lilac transition-transform duration-300 ease-(--ease-out) ${open ? "rotate-45" : ""}`}
        />
      </button>
    </div>
  );
}
