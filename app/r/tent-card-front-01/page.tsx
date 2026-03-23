"use client";

import { useEffect } from "react";

const TARGET = "https://cursorelsalvador.com/cafe-cursor-jet#menu";

export default function TentCardFrontRedirectPage() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <p className="sr-only">
      Redirecting… <a href={TARGET}>If you are not redirected, open the menu</a>
    </p>
  );
}
