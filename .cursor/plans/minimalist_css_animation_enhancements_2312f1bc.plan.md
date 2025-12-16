---
name: Minimalist CSS Animation Enhancements
overview: Add subtle, elegant CSS-only animations to lists, links, buttons, and images to enhance the minimalist aesthetic without adding clutter.
todos:
  - id: css-stagger
    content: Add staggered animation delays to `app/globals.css`
    status: completed
  - id: css-link-underline
    content: Implement `.link-underline` utility in `app/globals.css`
    status: completed
  - id: apply-stagger
    content: Apply staggered class to `MinimalBlogPreview`
    status: completed
    dependencies:
      - css-stagger
  - id: button-press
    content: Add active scale effect to `Button` component
    status: completed
  - id: image-fade
    content: Add fade-in animation to `PostImage`
    status: completed
---

# Minimalist CSS Animation Enhancements

## Core Philosophy

In a minimalist design, animations should not be decorative "flair" but functional cues that communicate hierarchy, affordance, and state. They must be:

- **Subtle**: No bounce, minimal distance, fast duration (<400ms).
- **Functional**: Guide the eye or confirm an action.
- **Performant**: CSS-only, hardware-accelerated properties.

## Animation Specifications

### 1. Staggered List Reveal (CSS-only)

**Purpose**:
Reduces cognitive load by introducing content in a digestible rhythm. Instead of a "wall of text" appearing instantly, items flow in one by one (fast). This guides the eye naturally from top to bottom, establishing the vertical reading order immediately.

**Implementation**:

- **File**: [`app/globals.css`](app/globals.css)
- **Mechanism**: Generic utility classes (e.g., `.wm-stagger-1`) that add `animation-delay` to `:nth-child` elements.
- **Usage**: Apply to the post list in [`components/landing/minimal-blog-preview.tsx`](components/landing/minimal-blog-preview.tsx).

### 2. Elegant Link Hover

**Purpose**:
Standard underlines can feel heavy or cluttered. A "growing" underline that expands from left-to-right on hover provides a clear affordance (this is clickable) while keeping the resting state clean. It adds a feeling of "sophistication" and polish to otherwise simple text links.

**Implementation**:

- **File**: [`app/globals.css`](app/globals.css)
- **Mechanism**: A `.link-underline` utility using `background-image` (linear-gradient) and `background-size` transition.
- **Usage**: Update generic prose links and navigation items in [`components/landing/minimal-header.tsx`](components/landing/minimal-header.tsx).

### 3. Button Micro-Press

**Purpose**:
Digital interfaces often lack tactile feedback. A subtle scale-down (98% or 95%) on click (`:active`) mimics the physical sensation of pressing a button. This confirms the user's input instantly, even before the action (like navigation) completes, making the app feel more responsive.

**Implementation**:

- **File**: [`components/ui/button.tsx`](components/ui/button.tsx)
- **Mechanism**: Add `active:scale-95` to button variants.

### 4. Image Blur-In

**Purpose**:
Images loading abruptly can cause jarring layout shifts or visual "pops". A fade-in (optionally with a blur-out effect) softens this arrival, making the image feel like it is "developing" onto the page. This contributes to a calm, high-quality feel.

**Implementation**:

- **File**: [`components/blog/post-image.tsx`](components/blog/post-image.tsx)
- **Mechanism**: Start with `opacity-0` and transition to `opacity-100` once the image is loaded (or use a simple CSS keyframe if relying on native loading behavior).

## Verification Plan

- **Reduced Motion**: Verify all animations are wrapped in or respect `prefers-reduced-motion`.
- **Performance**: Ensure no layout thrashing (use `transform` and `opacity`).
- **Contrast**: Check link hover states in Dark Mode.