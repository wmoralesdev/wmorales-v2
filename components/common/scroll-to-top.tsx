"use client";

import * as stylex from "@stylexjs/stylex";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { icon } from "@/lib/stylex/icons";

const styles = stylex.create({
  button: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    zIndex: 50,
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
});

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={stylex.props(styles.button).className}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp {...stylex.props(icon.md)} />
    </Button>
  );
}
