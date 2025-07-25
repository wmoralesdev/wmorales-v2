import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Optionally customize the pathnames for each locale
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/cursor': '/cursor',
    '/events': '/events',
    '/events/[slug]': '/events/[slug]',
    '/guestbook': '/guestbook',
    '/guestbook/[id]': '/guestbook/[id]',
    '/polls': '/polls',
    '/polls/[code]': '/polls/[code]',
    '/surveys': '/surveys',
    '/surveys/[id]/fill': '/surveys/[id]/fill',
    '/keystatic': '/keystatic',
    '/showcase': '/showcase'
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];