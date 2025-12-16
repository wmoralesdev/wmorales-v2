---
name: Minimal CSS animations
overview: "Add a tiny, CSS-first animation system: a smooth theme-toggle transition (accent-tinted micro-interaction) and a subtle enter animation for main pages. No animation libraries; works with Next.js server components and respects reduced-motion."
todos:
  - id: add-css-animations
    content: Add `wmReveal` + theme transition + accent ping utilities to `app/globals.css` (with reduced-motion guard).
    status: completed
  - id: apply-page-reveal
    content: Apply `wm-reveal` to the main container in `app/(main)/layout.tsx` so all main pages animate in subtly.
    status: completed
    dependencies:
      - add-css-animations
  - id: theme-toggle-transition
    content: Remove `disableTransitionOnChange` in `app/layout.tsx` and update `components/common/theme-toggle.tsx` to temporarily add `theme-transition` and `wm-theme-ping` on toggle.
    status: completed
    dependencies:
      - add-css-animations
---

# Minimal CSS-first animations

## Goals

- **CSS-first**: no animation libraries; minimal JS only to *trigger* a CSS transition on theme toggle.
- **Next.js / Server Components friendly**: animations applied via classes in server-rendered markup; no `use client` at `page.tsx`.
- **Subtle + accent-based**: short durations, low distances, uses `--accent`.
- **Low overload**: only 2 behaviors (theme toggle + page enter), and **respects `prefers-reduced-motion`**.

## Implementation

### 1) Theme toggle: smooth color transition + tiny accent “ping”

- Update [`app/layout.tsx`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/layout.tsx):
- Remove `disableTransitionOnChange` from `ThemeProvider` so we can control transitions ourselves.
- Keep `defaultTheme="dark"` and existing `attribute="class"`.

- Update [`components/common/theme-toggle.tsx`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/components/common/theme-toggle.tsx):
- On click, temporarily add `theme-transition` on `document.documentElement` for ~250–350ms.
- Optionally add a short-lived `wm-theme-ping` class on the button itself (accent-tinted ring/pulse), then remove.
- Keep it subtle: no big rotations, just a gentle scale/opacity or ring ping.

- Update [`app/globals.css`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/globals.css):
- Add utilities:
- `.theme-transition, .theme-transition * { transition-property: background-color,color,border-color,fill,stroke,box-shadow; transition-duration: ~200ms; }`
- `.wm-theme-ping { animation: wmThemePing ~350ms ease-out; }` using `var(--accent)` (e.g. via `color-mix(in oklch, var(--accent) 35%, transparent)`).
- Wrap all animation rules with `@media (prefers-reduced-motion: reduce)` to disable.

### 2) Initial page load: subtle “enter” animation for all main pages

- Update [`app/globals.css`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/globals.css):
- Add `@keyframes wmReveal` (opacity 0→1 + translateY a few px).
- Add `.wm-reveal` utility (animation ~450–600ms, gentle easing).

- Update `[app/(main)/layout.tsx](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/\\\\\(main)/layout.tsx)`:
- Apply `wm-reveal` to the main container (`div` that wraps `{children}`), so **home, blog list, blog post, design system** all get the same subtle enter.

### 3) Verify no overload + accessibility

- Ensure animations don’t affect layout stability (no height changes).
- Ensure focus styles remain clear; ping should not hide focus.
- Confirm reduced-motion disables both enter + ping.

## Files touched

- [`app/layout.tsx`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/layout.tsx)
- `[app/(main)/layout.tsx](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/\\\\\(main)/layout.tsx)`
- [`components/common/theme-toggle.tsx`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/components/common/theme-toggle.tsx)
- [`app/globals.css`](/Users/wmoralesdev/Workspaces/Personal/wmorales-v2/app/globals.css)

## Notes / defaults

- Durations will be short (**200–600ms**) and transforms tiny (**4–8px**).
- Accent usage stays consistent by deriving from existing `--accent`.