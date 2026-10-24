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
import { applyPref, readPref, type ThemePref } from "@/lib/theme";

/** Add an entry here to add a shortcut. */
const shortcuts = [
  { label: "Inicio", href: "/", icon: Home01Icon },
  { label: "Agendar llamada", href: "/book", icon: Calendar03Icon },
  { label: "Tarjeta de presentación", href: "/intro", icon: IdCardIcon },
];

const themes: { value: ThemePref; label: string; icon: typeof Sun03Icon }[] = [
  { value: "light", label: "Claro", icon: Sun03Icon },
  { value: "dark", label: "Oscuro", icon: Moon02Icon },
  { value: "system", label: "Sistema", icon: ComputerIcon },
];

/**
 * Floating Tools button on every page: the theme switch plus quick links to the
 * booking page and the intro card.
 */
export function ToolsPanel() {
  const pathname = usePathname();
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

  const links = shortcuts.filter((s) => s.href !== pathname);
  // On /intro's phone layout the button shares a row with the action bar.
  const place =
    pathname === "/intro"
      ? "bottom-[max(0.75rem,env(safe-area-inset-bottom))] lg:bottom-5"
      : "bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] md:bottom-5";

  return (
    <div
      ref={rootRef}
      className={`fixed right-3 z-40 flex flex-col items-end gap-2 font-sans md:right-5 ${place}`}
    >
      {open && (
        <section
          aria-label="Tools"
          className="w-[min(18rem,calc(100vw-1.5rem))] origin-bottom-right animate-fade-up border border-ink/10 bg-paper p-4 text-ink shadow-[0_18px_50px_-12px_rgb(18_13_38/0.35)]"
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

          <fieldset>
            <legend className="mb-1.5 text-muted text-small">Tema</legend>
            <div className="grid grid-cols-3 gap-1 bg-surface p-1">
              {themes.map((t) => (
                <label
                  key={t.value}
                  className={`press flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 font-semibold text-[0.75rem] transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                    theme === t.value
                      ? "bg-ink text-paper"
                      : "text-ink hover:bg-paper"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={t.value}
                    checked={theme === t.value}
                    onChange={() => pick(t.value)}
                    className="sr-only"
                  />
                  <Icon icon={t.icon} size={16} />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>

          {links.length > 0 && (
            <nav aria-label="Accesos rápidos" className="mt-4 space-y-1">
              {links.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="press group/link flex min-h-10 items-center gap-2.5 bg-surface px-3 text-small transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon icon={s.icon} size={18} />
                  <span className="flex-1">{s.label}</span>
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
        aria-label="Tools"
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
