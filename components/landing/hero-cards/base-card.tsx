/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type BaseCardProps = {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  defaultPosition?: { x: number; y: number };
  isDraggable?: boolean;
  variants?: Variants;
  whileHover?: string;
  animate?: any;
  transition?: any;
  animateFloat?: boolean;
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

const STORAGE_KEY = 'hero-cards-positions';

// Reset all card positions
export function resetCardPositions() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

export function BaseCard({
  id,
  children,
  className,
  containerClassName,
  defaultPosition,
  isDraggable = true,
  variants = cardVariants,
  whileHover = 'hover',
  animate,
  transition,
  animateFloat = false,
}: BaseCardProps) {
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Load position from localStorage
  useEffect(() => {
    if (!(isDesktop && isDraggable)) {
      return;
    }

    const savedPositions = localStorage.getItem(STORAGE_KEY);
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      if (positions[id]) {
        setPosition(positions[id]);
      }
    }
  }, [id, isDesktop, isDraggable]);

  // Save position to localStorage
  const savePosition = (newPosition: { x: number; y: number }) => {
    if (!(isDesktop && isDraggable)) {
      return;
    }

    const savedPositions = localStorage.getItem(STORAGE_KEY);
    const positions = savedPositions ? JSON.parse(savedPositions) : {};
    positions[id] = newPosition;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  };

  const handleDragEnd = (_: any, info: any) => {
    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    };
    setPosition(newPosition);
    savePosition(newPosition);
    setIsDragging(false);
  };

  const dragConstraints = {
    left: -300,
    right: 300,
    top: -300,
    bottom: 300,
  };

  const combinedAnimate = animateFloat
    ? { ...animate, ...floatVariants.animate }
    : animate;

  return (
    <motion.div
      animate={combinedAnimate}
      className={cn('cursor-pointer', containerClassName, isDragging && 'z-50')}
      drag={isDesktop && isDraggable}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
      ref={cardRef}
      style={{
        x: isDesktop && isDraggable ? position.x : 0,
        y: isDesktop && isDraggable ? position.y : 0,
      }}
      transition={transition}
      variants={variants}
      whileHover={whileHover}
    >
      <Card
        className={cn(
          'h-full transition-colors',
          'hover:border-purple-800/50',
          isDragging && 'cursor-grabbing shadow-2xl',
          !isDragging && isDesktop && isDraggable && 'cursor-grab',
          className
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}
