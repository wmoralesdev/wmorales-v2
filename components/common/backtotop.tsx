'use client';

import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-[9999] cursor-pointer hover:bg-purple-500/10 hover:text-purple-500"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="size-4" />
        </Button>
      )}
    </AnimatePresence>
  );
}
