import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Optionally customize the pathnames for each locale
  pathnames: {
    '/': '/',
    '/blog': {
      en: '/blog',
      es: '/blog'
    },
    '/blog/[slug]': {
      en: '/blog/[slug]',
      es: '/blog/[slug]'
    },
    '/cursor': {
      en: '/cursor',
      es: '/cursor'
    },
    '/events': {
      en: '/events',
      es: '/eventos'
    },
    '/events/[slug]': {
      en: '/events/[slug]',
      es: '/eventos/[slug]'
    },
    '/guestbook': {
      en: '/guestbook',
      es: '/libro-visitas'
    },
    '/guestbook/[id]': {
      en: '/guestbook/[id]',
      es: '/libro-visitas/[id]'
    },
    '/polls': {
      en: '/polls',
      es: '/encuestas'
    },
    '/polls/[code]': {
      en: '/polls/[code]',
      es: '/encuestas/[code]'
    },
    '/surveys': {
      en: '/surveys',
      es: '/formularios'
    },
    '/surveys/[id]/fill': {
      en: '/surveys/[id]/fill',
      es: '/formularios/[id]/completar'
    },
    '/keystatic': {
      en: '/keystatic',
      es: '/keystatic'
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];