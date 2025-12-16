"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const supportedLocales = ["en", "es"] as const;
const COOKIE_NAME = "wm_locale";

export async function setLocale(locale: string, pathname: string) {
  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  redirect(pathname);
}
