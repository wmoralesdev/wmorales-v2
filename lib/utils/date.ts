import { format, formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

// Mapping between next-intl locales and date-fns locales
const dateLocales = {
  en: enUS,
  es,
} as const;

export type SupportedLocale = keyof typeof dateLocales;

/**
 * Get the date-fns locale object for a given locale string
 */
export function getDateLocale(locale: string): typeof enUS {
  return dateLocales[locale as SupportedLocale] || dateLocales.en;
}

/**
 * Format distance to now with locale support
 */
export function formatDistanceToNowLocalized(
  date: Date | number,
  locale: string,
  options?: Parameters<typeof formatDistanceToNow>[1]
): string {
  return formatDistanceToNow(date, {
    ...options,
    locale: getDateLocale(locale),
  });
}

/**
 * Format date with locale support
 */
export function formatLocalized(
  date: Date | number,
  formatStr: string,
  locale: string,
  options?: Parameters<typeof format>[2]
): string {
  return format(date, formatStr, {
    ...options,
    locale: getDateLocale(locale),
  });
}
