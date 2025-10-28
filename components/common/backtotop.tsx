"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Button
          className="fixed right-4 bottom-4 z-[9999] cursor-pointer hover:bg-purple-500/10 hover:text-purple-500"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="icon"
          variant="outline"
        >
          <ChevronUp className="size-4" />
        </Button>
      )}
    </AnimatePresence>
  );
}
