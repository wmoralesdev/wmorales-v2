# Style Guidelines - Dark Theme Portfolio

This document outlines the design system and style guidelines used throughout the portfolio website. It serves as a reference for maintaining consistency when creating new components or pages.

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Animations](#animations)
- [Glassmorphism Effects](#glassmorphism-effects)
- [Interactive Elements](#interactive-elements)
- [Responsive Design](#responsive-design)

## Color Palette

### Base Colors

```css
/* Background Colors */
--bg-primary:
  black --bg-secondary: gray-900 --bg-tertiary: gray-800 /* Text Colors */
    --text-primary: white --text-secondary: gray-300 --text-muted: gray-400,
  gray-500 /* Accent Colors */ --accent-primary: purple-400, purple-500,
  purple-600 --accent-secondary: purple-200,
  purple-300 --accent-success: green-400,
  green-500 --accent-warning: yellow-400, yellow-500 --accent-danger: red-500;
```

### Gradient Definitions

```css
/* Text Gradients */
.gradient-primary: bg-gradient-to-r from-white via-purple-200 to-purple-400
.gradient-secondary: bg-gradient-to-r from-purple-400 to-purple-600

/* Background Gradients */
.gradient-bg-main: bg-gradient-to-br from-black via-gray-900 to-black
.gradient-bg-purple: bg-gradient-to-r from-purple-900/30 to-purple-800/30
.gradient-bg-accent: bg-gradient-to-r from-purple-500/20 to-purple-600/20
```

### Opacity Variations

- Card backgrounds: `/80, /60, /50, /40, /30`
- Borders: `/50, /30`
- Subtle effects: `/20, /10`

## Typography

### Font Sizes

```css
/* Headings */
.text-hero: text-4xl sm:text-5xl lg:text-6xl
.text-section: text-2xl sm:text-3xl lg:text-4xl
.text-card-title: text-sm lg:text-base

/* Body Text */
.text-body: text-xs lg:text-sm
.text-small: text-xs
.text-tiny: text-[10px]

/* Special */
.text-code: font-mono text-[10px] lg:text-xs
```

### Font Weights

- Headings: `font-bold` or `font-semibold`
- Body text: `font-medium` or default
- Muted text: default weight with muted colors

## Spacing & Layout

### Container Widths

```css
.container-main: max-w-7xl
.container-card-sm: w-48 to w-56
.container-card-md: w-60 to w-64
.container-card-lg: w-72
```

### Padding Scale

```css
/* Cards */
.padding-card-sm: p-3 lg:p-4
.padding-card-md: p-4 lg:p-6
.padding-badge: px-5 py-3 or px-6 py-3

/* Sections */
.padding-section: px-4 pt-24 pb-16 sm:px-6 lg:px-8
```

### Grid Layouts

- Mobile: Single column
- Tablet: 2 columns (`sm:grid-cols-2`)
- Desktop: Custom absolute positioning or 3 columns

## Components

### Cards

```tsx
/* Base Card Styles */
className =
  'backdrop-blur-xl border transition-colors cursor-pointer hover:border-purple-800/50';

/* Card Variants */
// Default
('bg-gray-900/80 border-gray-800');

// Accent
('bg-gradient-to-br from-purple-900/40 to-gray-900/40 border-purple-800/50');

// Dark
('bg-black/80 border-gray-800'); // or bg-black/90

// Special
('bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-purple-700/50');
```

### Badges

```tsx
/* Badge Variants */
// Default
className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs"

// Success
className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"

// Outline
variant="outline" className="border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/10"
```

### Buttons

```tsx
/* Primary Button */
className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"

/* Outline Button */
variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
```

## Animations

### Motion Variants

```tsx
/* Container Animation */
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

/* Card Animation */
const cardVariants = {
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

/* Float Animation */
const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};
```

### Special Animations

- Rotating elements: `animate={{ rotate: 360 }}` with infinite repeat
- Pulsing glow: `animate={{ scale: [1, 1.2, 1] }}` with infinite repeat
- Coffee cup wiggle: `animate={{ rotate: [0, -10, 10, -10, 0] }}`

## Glassmorphism Effects

### Standard Glass Effect

```css
.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(17, 25, 40, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
```

### Tailwind Classes

```tsx
className = 'backdrop-blur-xl bg-gray-900/80 border-gray-800';
```

## Interactive Elements

### Hover States

- Cards: Scale to 1.05, border color change
- Badges: Add subtle background
- Links: Color transition to purple-400
- Buttons: Gradient shift, shadow enhancement

### Draggable Cards (Desktop Only)

- Cursor changes: `cursor-grab` → `cursor-grabbing`
- Shadow on drag: `shadow-2xl`
- Z-index elevation: `z-50`
- Smooth drag with elastic constraints

## Responsive Design

### Breakpoints

- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `lg:` (1024px+)

### Mobile-First Approach

```tsx
// Size progression
className = 'text-xs lg:text-sm';
className = 'p-4 lg:p-6';
className = 'h-6 lg:h-8 w-6 lg:w-8';

// Layout changes
className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
className = 'text-center lg:text-left';
className = 'hidden lg:block';
```

### Desktop Features

- Absolute positioning for cards
- Draggable functionality
- Larger spacing and typography
- More complex animations

## Usage Examples

### Creating a New Card Component

```tsx
import { BaseCard } from '@/components/landing/hero-cards';

export function NewCard(props) {
  return (
    <BaseCard
      id="unique-id"
      className="p-4 lg:p-6 bg-gray-900/80 backdrop-blur-xl border-gray-800"
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 lg:h-6 w-5 lg:w-6 text-purple-400" />
          <span className="text-xs lg:text-sm font-medium text-white">
            Title
          </span>
        </div>
        <p className="text-xs text-gray-500">Description</p>
      </div>
    </BaseCard>
  );
}
```

### Creating a New Section

```tsx
<section className="relative min-h-screen overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-7xl">
    {/* Your content here */}
  </div>
</section>
```

## Best Practices

1. **Consistency**: Always use the predefined color palette and spacing scale
2. **Accessibility**: Ensure sufficient color contrast and include hover/focus states
3. **Performance**: Use `backdrop-blur` sparingly as it can impact performance
4. **Animations**: Keep animations subtle and purposeful
5. **Mobile-First**: Design for mobile, then enhance for desktop
6. **Dark Theme**: All components should work seamlessly with the dark theme
7. **Glassmorphism**: Use translucent backgrounds with backdrop blur for depth

## Component Library Integration

When using shadcn/ui components, apply these overrides:

- Remove light mode styles
- Apply dark theme colors directly
- Add glassmorphism effects where appropriate
- Ensure hover states match the design system
