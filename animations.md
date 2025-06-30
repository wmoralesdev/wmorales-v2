# Animation Guidelines for Portfolio Sections

## Overview

This document provides instructions for implementing consistent, high-quality animations using Framer Motion across all portfolio sections. Follow these patterns to maintain visual coherence and optimal performance.

## Core Animation Principles

### 1. Use Framer Motion for All Animations

- Replace CSS animations with Framer Motion for better control and performance
- Import: `import { motion } from "framer-motion";`
- Convert all animated elements to motion components (e.g., `<motion.div>`)

### 2. TypeScript Compatibility

- Use proper easing arrays instead of strings: `[0.25, 0.46, 0.45, 0.94]` instead of `"easeOut"`
- Add type assertions for animation types: `type: "spring" as const`
- Avoid any TypeScript errors by using correct variant types

### 3. Animation Timing

- Entrance animations: 0.5-0.8s duration
- Hover effects: 0.2-0.3s duration
- Stagger children: 0.05-0.1s delays
- Use viewport triggers for scroll-based animations

## Animation Patterns

### Entrance Animations

#### Container Stagger Pattern

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};
```

#### Item Fade-In Pattern

```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
```

#### Scale-In Pattern (for emphasis)

```typescript
const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
```

### Hover Interactions

#### Card Hover Effect

```typescript
const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
```

#### Icon Rotation Effect

```typescript
const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
```

#### Badge/Pill Hover Effect

```typescript
const badgeVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 2,
    transition: {
      duration: 0.2,
      type: "spring" as const,
      stiffness: 300,
    },
  },
  tap: {
    scale: 0.95,
    rotate: -2,
  },
};
```

### Background Elements

#### Floating Particles

```typescript
const particleVariants = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

#### Gradient Orbs

```typescript
const orbVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

### Micro-Interactions

#### Text Slide on Hover

```typescript
whileHover={{ x: 5 }}
transition={{ duration: 0.2 }}
```

#### Continuous Animation (for accents)

```typescript
animate={{
  scale: [1, 1.1, 1],
  rotate: [0, 5, -5, 0]
}}
transition={{
  duration: 2,
  repeat: Infinity,
  repeatDelay: 5
}}
```

## Implementation Guidelines

### 1. Section Structure

```typescript
// Make component client-side for interactions
"use client";

// Main section wrapper with viewport trigger
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={containerVariants}
>
  {/* Content */}
</motion.section>;
```

### 2. Staggered Content Reveal

- Apply containerVariants to parent elements
- Apply itemVariants to child elements
- Use different delays for sequential reveals

### 3. Interactive Elements

```typescript
<motion.div
  variants={cardVariants}
  whileHover="hover"
  whileTap="tap"
  initial="rest"
>
  {/* Interactive content */}
</motion.div>
```

### 4. Performance Optimizations

- Use `viewport={{ once: true }}` for entrance animations
- Limit the number of animated elements on screen
- Use transform properties (scale, rotate, translate) over layout properties
- Add `will-change: transform` for frequently animated elements

### 5. Accessibility

- Respect user's motion preferences
- Keep animations subtle and purposeful
- Ensure content is readable during animations
- Don't rely solely on animation to convey information

## Color Theme Integration

### Consistent Purple Theme

- Primary animations: Use purple-400 to purple-600 range
- Shadows: `rgba(168, 85, 247, 0.15)` for purple glow
- Gradients: `from-purple-500 to-pink-500` for accents
- Timeline elements: Purple-400 with fade to transparent

### Dark Mode Considerations

- Use opacity variations for subtlety
- White accents with low opacity for particles
- Ensure sufficient contrast during animations

## Specific Section Patterns

### Hero Section

- Dramatic entrance with scale and fade
- Floating background particles with varied timing
- Animated gradient text for name
- Continuous sparkle rotations
- Interactive CTA with shadow effects

### About Section

- Cards with hover lift effects
- Skill badges with staggered entrance
- Icon rotations on hover
- Spring animations for playful elements
- Number counters with spring physics

### Experience Section

- Timeline with animated line growth
- Dots that scale in with spring physics
- Cards that slide horizontally on hover
- Compact spacing with micro-interactions
- Achievement bullets with hover states

### Contact Section

- Form fields with focus animations
- Button state transitions
- Success/error state animations
- Social icon hover effects

## Common Pitfalls to Avoid

1. **Over-animation**: Keep it subtle and purposeful
2. **Inconsistent timing**: Use similar durations across sections
3. **Missing TypeScript types**: Always use proper type assertions
4. **Forgetting viewport triggers**: Animations should trigger when visible
5. **Complex animation chains**: Keep it simple and performant

## Testing Checklist

- [ ] All animations run at 60fps
- [ ] No TypeScript errors
- [ ] Animations trigger correctly on scroll
- [ ] Hover states work on all interactive elements
- [ ] Mobile touch interactions feel responsive
- [ ] Reduced motion preference is respected
- [ ] Content is accessible during animations

## Example Implementation

```typescript
"use client";

import { motion } from "framer-motion";

export function AnimatedSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-16"
    >
      <motion.h2 variants={itemVariants}>Title</motion.h2>
      <motion.p variants={itemVariants}>Content</motion.p>
    </motion.section>
  );
}
```

Follow these guidelines to maintain consistency and create a polished, professional animation experience throughout the portfolio.
