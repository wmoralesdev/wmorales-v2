import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { baseMetadata } from "@/lib/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// biome-ignore lint/suspicious/useAwait: Next.js generateMetadata signature requires async
export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // biome-ignore lint/suspicious/noExplicitAny: next-intl types require this cast
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
