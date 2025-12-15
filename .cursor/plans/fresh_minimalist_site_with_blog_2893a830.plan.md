---
name: Fresh Minimalist Site With Blog
overview: Rebuild the site from scratch as an ultra-minimal personal site inspired by gharbi.me, with a single minimalist homepage plus a simple markdown-powered blog (`/blog`, `/blog/[slug]`). Ignore existing implementations and keep routing, data fetching, and styling as simple as possible.
todos:
  - id: layouts-theme
    content: Simplify app/layout.tsx and globals.css for a minimal purple-accented theme while keeping dark/light mode
    status: pending
  - id: homepage-sections
    content: Create minimal homepage sections and wire into / page.tsx
    status: pending
    dependencies:
      - layouts-theme
  - id: blog-lib
    content: Implement lib/blog.ts to read markdown files from content/blog
    status: pending
    dependencies:
      - layouts-theme
  - id: blog-content
    content: Create initial markdown posts under content/blog with frontmatter
    status: pending
    dependencies:
      - blog-lib
  - id: blog-pages
    content: Implement /blog and /blog/[slug] pages using blog utilities
    status: pending
    dependencies:
      - blog-lib
      - blog-content
  - id: refine-style
    content: Polish spacing, typography, and colors to closely match gharbi.me aesthetic
    status: pending
    dependencies:
      - homepage-sections
      - blog-pages
  - id: cleanup-legacy
    content: Delete legacy pages/components/hooks once new site is stable
    status: pending
    dependencies:
      - homepage-sections
      - blog-pages
---

# Fresh Minimalist Site with Markdown Blog

Rebuild the app as a minimalist site: **homepage + simple markdown blog**, nothing else. Ignore current implementations and favor the simplest possible Next.js 15 App Router + TypeScript setup.

## 1. High-level Structure

- **Routes**
  - `/` – Minimal personal homepage (inspired by `gharbi.me`)
  - `/blog` – Blog index listing posts (title, date, short description)
  - `/blog/[slug]` – Individual blog post pages rendered from markdown
- **Content**
  - Store markdown files under `content/blog/*.md` (or `.mdx` if we later want components)
  - Each file uses **frontmatter** for metadata: `title`, `date`, `summary`, `tags?`, `published?`
- **Rendering**
  - Use **server components** for all pages
  - Parse markdown at build/runtime using `gray-matter` + `remark` + `remark-html` (no heavy MDX stack)

## 2. Folder Layout (Target)

- `app/`
  - `layout.tsx` – Root layout: fonts, dark theme body, wraps everything
  - `globals.css` – Tailwind base + minimal custom utilities
  - `[locale]/`
    - `layout.tsx` – Localized wrapper if needed, or we can simplify to non-locale if you prefer later
    - `(main)/`
      - `layout.tsx` – Minimal wrapper (no navbar/footer components)
      - `page.tsx` – Homepage
      - `blog/`
        - `page.tsx` – Blog index
        - `[slug]/page.tsx` – Blog post page
- `components/`
  - `landing/`
    - `minimal-header.tsx`
    - `minimal-experiences.tsx`
    - `minimal-tech.tsx`
    - `minimal-footer.tsx`
  - `blog/`
    - `blog-list.tsx` – Renders blog index list
    - `blog-post-meta.tsx` – Title/date/meta block for post pages
  - `ui/` – Keep shadcn primitives in case we need subtle UI (links, badge, etc.)
- `content/`
  - `blog/`
    - `first-post.md`
    - `another-post.md`
- `lib/`
  - `blog.ts` – Utilities to read markdown files and expose typed metadata

## 3. Minimal Homepage Design (`/`)

**Goals**: match the feel of `gharbi.me`: dark background, strong typography, almost no ornament.

- **`page.tsx`** (`[locale]/(main)/page.tsx`)
  - Uses only a few vertical sections inside a centered column (`max-w-3xl mx-auto px-4 py-16`):

    1. `minimal-header` – name, small bio, social links
    2. `minimal-experiences` – simple experience list
    3. `minimal-tech` – short tech stack
    4. `minimal-footer` – copyright / small note

  - No hero gradients, no framer-motion, no animated background.

- **`minimal-header.tsx`**
  - Server component returning:
    - Large name (e.g. `text-4xl font-semibold`), subtitle (role / tagline)
    - Very small, monochrome inline links: `GitHub · LinkedIn · Twitter`
    - Optional location line underneath in muted text
  - Layout similar to gharbi.me: left-aligned, stacked vertically, no cards.

- **`minimal-experiences.tsx`**
  - Hard-coded or simple data array of jobs for now; you can edit in code.
  - Each item: **Company**, role, period, short tech stack line.
  - Visual style:
    - Section label `EXPERIENCES` in small uppercase, tracking-wide.
    - Each experience as text rows, maybe separated with subtle `border-t border-neutral-800`.
    - Optional simple bullet on the left, no icons.

- **`minimal-tech.tsx`**
  - Section label `TECH` in small uppercase.
  - One or two lines of inline tech names separated by `·` or commas.
  - No badges, no icons; just text in muted color.

- **`minimal-footer.tsx`**
  - Single centered line such as: `© 2025 Walter Morales`
  - Very small, muted text at bottom of the page.

## 4. Markdown Blog Design

### 4.1 Content Format (`content/blog/*.md`)

- Example `content/blog/first-post.md`:
```markdown
---
slug: first-post
title: "First Post"
date: "2025-01-01"
summary: "Short one-line description of the post."
tags: ["nextjs", "personal"]
published: true
---

Your markdown content here.

- Bullet points
- Code blocks
```


### 4.2 Blog Utilities (`lib/blog.ts`)

- Implement a small API used by pages:
  - `getAllPosts(): Promise<PostMeta[]>` – read all `*.md`, parse frontmatter, sort by `date` desc, filter by `published`.
  - `getPostBySlug(slug: string): Promise<{ meta: PostMeta; contentHtml: string }>` – read one file, parse frontmatter, convert markdown to HTML with `remark`.
- Define a `PostMeta` type:
  - `slug: string`
  - `title: string`
  - `date: string`
  - `summary?: string`
  - `tags?: string[]`
- Use Node `fs` / `path` directly (server-only code) inside `lib/blog.ts`.

### 4.3 Blog Index Page (`/blog`)

- File: `app/[locale]/(main)/blog/page.tsx`
- Server component that:
  - Calls `getAllPosts()` at request time or build time.
  - Renders a plain list:
    - Title (link to `/blog/[slug]`)
    - Date in muted small text
    - Optional summary line
- Layout:
  - Reuse same centered column as homepage (`max-w-3xl mx-auto px-4 py-16`).
  - Top heading `Blog` + small description line.
  - Each post separated with vertical spacing and a thin divider.

### 4.4 Blog Post Page (`/blog/[slug]`)

- File: `app/[locale]/(main)/blog/[slug]/page.tsx`
- Server component that:
  - Receives `params.slug`.
  - Calls `getPostBySlug(slug)`; if not found, returns `notFound()`.
  - Renders:
    - Title (large text), date, tags if present.
    - Article body using `dangerouslySetInnerHTML` with sanitized HTML from `remark-html`.
- Styling:
  - Narrow column with `prose`-style typography using Tailwind's typography plugin, but kept monochrome.
  - No share buttons, no author boxes—just content.

## 5. Layout & Theming

### 5.1 Root Layout (`app/layout.tsx`)

- Keep fonts defined via `next/font` as now (Space Grotesk, Poppins, JetBrains Mono).
- Simplify providers:
  - Wrap only what is absolutely necessary (e.g. `ThemeProvider` to keep dark class, `Analytics` if you want).
  - Remove `AnimatedMesh`, complex providers not needed for homepage/blog.
- Body classes:
  - `min-h-screen bg-neutral-950 text-neutral-100 antialiased` (tailored to dark-only theme).

### 5.2 Globals (`app/globals.css`)

- Keep Tailwind base and dark theme from `always_applied_workspace_rules`.
- Simplify variables to a minimal set:
  - `--background`, `--foreground`, `--muted`, `--accent`.
- Use Tailwind typography plugin for `.prose` (limit colors to light-on-dark).
- Remove animation keyframes and special utilities that are no longer used.

## 6. Cleanup of Old Code

Even though we won't touch during the initial rebuild, plan to delete later:

- **Pages / Routes**: guestbook, events, cursor, API routes that belong exclusively to them.
- **Components**: entire feature folders for guestbook, events, polls, surveys, old landing sections, navbar/footer, animated backgrounds.
- **Hooks and libs**: realtime guestbook/event hooks and stores, event-specific types and utils.

We'll do deletion only after the new homepage and blog are working and type-safe.

## 7. Implementation Order

1. **Set up minimal layouts & theme**

   - Simplify `app/layout.tsx` and `app/globals.css` for dark-only, minimalist UI.

2. **Implement homepage sections**

   - Build `minimal-header`, `minimal-experiences`, `minimal-tech`, `minimal-footer`.
   - Wire them into `app/[locale]/(main)/page.tsx`.

3. **Implement markdown blog utilities**

   - Create `lib/blog.ts` with `getAllPosts` and `getPostBySlug`.
   - Create `content/blog/example.md`.

4. **Build blog pages**

   - Implement `/blog` index and `/blog/[slug]` detail pages using the utilities.

5. **Refinement pass**

   - Tweak spacing, typography, and colors to best match `gharbi.me` feel.
   - Verify TypeScript types and strictness.

6. **Cleanup**

   - Remove unused legacy pages, components, hooks, and libs once the new flow is stable.