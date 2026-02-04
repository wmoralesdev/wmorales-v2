"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const DISMISSED_KEY = "wm_cookie_notice_dismissed";
const TOAST_ID = "wm-cookie-notice";

export function CookieNotice() {
  const t = useTranslations("common.cookieNotice");

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISSED_KEY) === "1";
    if (dismissed) return;

    toast.message(t("message"), {
      id: TOAST_ID,
      duration: Number.POSITIVE_INFINITY,
      closeButton: false,
      action: {
        label: t("dismiss"),
        onClick: () => {
          window.localStorage.setItem(DISMISSED_KEY, "1");
          toast.dismiss(TOAST_ID);
        },
      },
    });
  }, [t]);

  return null;
}
