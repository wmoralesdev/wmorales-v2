"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | Document) => void;
      };
      ready?: (callback: (twttr: Window["twttr"]) => void) => void;
    };
  }
}

export function TweetEmbeds() {
  useEffect(() => {
    const loadWidgets = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load();
      }
    };

    const observer = new MutationObserver(() => {
      const iframeCount = document.querySelectorAll(
        'iframe[id^="twitter-widget"]',
      ).length;
      if (iframeCount > 0) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.twttr?.ready) {
      window.twttr.ready(loadWidgets);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Script
      src="https://platform.twitter.com/widgets.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (window.twttr?.ready) {
          window.twttr.ready((twttr) => {
            twttr?.widgets?.load();
          });
        }
      }}
    />
  );
}
