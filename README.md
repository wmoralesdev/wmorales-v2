# wmorales.dev

Landing de Walter Morales, consultor de IA y fundador de Ai Labs. Next.js 16 (App Router), Tailwind CSS v4, GSAP y Motion. Sin API keys ni servicios externos.

## Rutas

| Ruta     | Qué es                                                                      |
| -------- | --------------------------------------------------------------------------- |
| `/`      | Home: hero waterline, servicios, Ai Labs, trayectoria, comunidad, FAQ y CTA |
| `/book`  | Calendario de Google embebido dentro de un marco con el estilo del sitio    |
| `/intro` | Tarjeta de presentación con QR (sitio, agenda o vCard). `noindex`           |

Las rutas del sitio anterior (`/blog`, `/slides`, `/r/:code`, etc.) redirigen con 308 a `/`.

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # todo se prerenderiza como estático
pnpm lint         # biome
pnpm typecheck
pnpm halftone     # regenera public/photos, public/halftone y lib/portrait-dots.ts
```

## Contenido

Todo el texto y los datos viven en `lib/site.ts`: la home, el JSON-LD, `/llms.txt` y la vCard leen de ahí.

Las fotos originales van en `assets/photos/` (sin EXIF ni GPS). `pnpm halftone` genera:
- `public/photos/*.jpg`: la foto re-codificada.
- `public/halftone/*.webp`: máscara de puntos que CSS colorea con `mask-image`.
- `lib/portrait-dots.ts`: la grilla de luminancia del retrato interactivo.

## Agenda

`BOOKING_URL` en `lib/site.ts` es el link corto de Google Calendar. Para el embed más limpio, copiá en Google Calendar → página de reservas → **Compartir → Insertar en sitio web** la URL `https://calendar.google.com/calendar/appointments/schedules/…?gv=true` y ponela en `NEXT_PUBLIC_BOOKING_EMBED_URL` (o directamente en `BOOKING_EMBED_URL`). Si el iframe no carga, la página muestra un enlace para abrir el calendario en otra pestaña.

## SEO, GEO y AEO

- Metadata con title/description orientados a "consultor de IA" y "fundador de Ai Labs", canonical, Open Graph y Twitter con imágenes generadas (`app/opengraph-image.tsx`).
- JSON-LD en un solo `@graph`: `Person`, `Organization` (Ai Labs, con `founder`), `ProfessionalService`, `WebSite`, `ProfilePage` y `FAQPage`; `/book` lleva `WebPage` + `BreadcrumbList` + `ReserveAction`.
- `robots.txt` permite explícitamente a los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), `sitemap.xml` y `llms.txt` con el perfil en texto plano.
- FAQ visible en la página con respuestas cortas y directas, pensadas para ser citadas.

`NEXT_PUBLIC_SITE_URL` cambia el dominio canónico (por defecto `https://wmorales.dev`).
