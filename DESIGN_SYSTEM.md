# Design System Guide

## Overview
Complete design system with consistent styling, spacing, and components.

## Colors

### Primary Colors
- **Blue**: `#3b82f6` - Primary actions, links
- **Purple**: `#8b5cf6` - Gradients, accents
- **Gray-900**: `#111827` - Dark backgrounds
- **Gray-800**: `#1f2937` - Card backgrounds
- **White**: `#ffffff` - Text, borders (with opacity)

### Semantic Colors
- **Success**: `#22c55e` - Green for success states
- **Warning**: `#fbbf24` - Yellow for warnings
- **Danger**: `#ef4444` - Red for errors
- **Info**: `#60a5fa` - Light blue for information

## Typography

### Font Family
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Headings
- **H1**: `clamp(2rem, 5vw, 3rem)` - Page titles
- **H2**: `clamp(1.5rem, 4vw, 2.25rem)` - Section titles
- **H3**: `clamp(1.25rem, 3vw, 1.875rem)` - Subsection titles
- **H4**: `clamp(1.125rem, 2.5vw, 1.5rem)` - Card titles

### Body Text
- **Base**: `1rem` (16px) - Default text
- **Small**: `0.875rem` (14px) - Secondary text
- **Tiny**: `0.75rem` (12px) - Labels, captions

## Spacing

### Scale
- **0.25rem** (4px) - Tiny gaps
- **0.5rem** (8px) - Small gaps
- **0.75rem** (12px) - Medium gaps
- **1rem** (16px) - Default gaps
- **1.5rem** (24px) - Large gaps
- **2rem** (32px) - Extra large gaps

### Padding
- **Cards**: `1.5rem` (24px)
- **Buttons**: `0.75rem 1.5rem` (12px 24px)
- **Inputs**: `0.75rem 1rem` (12px 16px)
- **Containers**: `1rem` mobile, `2rem` desktop

## Components

### Buttons

#### Primary Button
```html
<button class="btn-primary">
  Click Me
</button>
```

#### Secondary Button
```html
<button class="btn-secondary">
  Cancel
</button>
```

#### Icon Button
```html
<button class="btn-icon">
  <svg>...</svg>
</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    <p>Content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn-primary">Action</button>
  </div>
</div>
```

### Inputs

```html
<div class="input-wrapper">
  <span class="input-icon">
    <svg>...</svg>
  </span>
  <input type="text" placeholder="Enter text">
</div>
```

### Modals

```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Modal Title</h3>
      <button class="btn-icon">×</button>
    </div>
    <div class="modal-body">
      <p>Modal content</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Error</span>
```

### Grid Layout

```html
<div class="grid-layout cols-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

## Animations

### Transitions
- **Fast**: `0.2s` - Hover effects, color changes
- **Normal**: `0.3s` - Transform, layout changes
- **Slow**: `0.5s` - Complex animations

### Keyframes
- **fadeIn**: Fade in from opacity 0
- **slideUp**: Slide up from bottom
- **spin**: Rotate 360 degrees
- **shimmer**: Loading skeleton effect

## Best Practices

### 1. Consistent Spacing
Always use the spacing scale. Avoid arbitrary values.

```css
/* ✅ Good */
padding: 1rem;
margin-bottom: 1.5rem;

/* ❌ Bad */
padding: 13px;
margin-bottom: 23px;
```

### 2. Use Semantic Classes
Use meaningful class names that describe purpose.

```html
<!-- ✅ Good -->
<button class="btn-primary">Submit</button>

<!-- ❌ Bad -->
<button class="blue-button">Submit</button>
```

### 3. Mobile-First
Always design for mobile first, then enhance for larger screens.

```css
/* ✅ Good */
.element {
  padding: 1rem; /* Mobile */
}
@media (min-width: 1024px) {
  .element {
    padding: 2rem; /* Desktop */
  }
}
```

### 4. Accessibility
- Minimum 44px touch targets on mobile
- Sufficient color contrast (WCAG AA)
- Focus visible states
- Semantic HTML

### 5. Performance
- Use CSS transforms for animations
- Avoid layout thrashing
- Lazy load images
- Code split large components

## Common Patterns

### Hero Section
```html
<section class="hero">
  <div class="main-container">
    <h1>Welcome to Platform</h1>
    <p>Build amazing things</p>
    <div class="button-group">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">Learn More</button>
    </div>
  </div>
</section>
```

### Feature Grid
```html
<div class="grid-layout cols-3">
  <div class="feature-card">
    <div class="card-header">
      <svg class="icon">...</svg>
      <h3 class="card-title">Feature 1</h3>
    </div>
    <div class="card-body">
      <p>Description</p>
    </div>
  </div>
  <!-- More cards -->
</div>
```

### Form Layout
```html
<form class="space-y-4">
  <div class="input-wrapper">
    <label>Email</label>
    <input type="email" placeholder="you@example.com">
  </div>
  <div class="input-wrapper">
    <label>Password</label>
    <input type="password" placeholder="••••••••">
  </div>
  <button type="submit" class="btn-primary" style="width: 100%">
    Sign In
  </button>
</form>
```

## Quick Reference

### Utility Classes
- `.flex-center` - Center items with flexbox
- `.flex-between` - Space between with flexbox
- `.text-center` - Center text
- `.text-truncate` - Truncate with ellipsis
- `.space-y-4` - Vertical spacing between children
- `.transition-all` - Smooth transitions
- `.loading-spinner` - Loading indicator
- `.skeleton` - Skeleton loading state

### Responsive Utilities
- `.hide-mobile` - Hide on mobile
- `.show-mobile` - Show only on mobile
- `.hide-desktop` - Hide on desktop
- `.show-desktop` - Show only on desktop

## File Structure
```
src/styles/
├── design-fixes.css          # Main design system
├── responsive-enhanced.css   # Responsive utilities
├── editor-responsive.css     # Editor-specific styles
├── responsive.css            # Legacy responsive
└── scrollbar.css            # Custom scrollbar
```

## Usage Example

```jsx
import './styles/design-fixes.css';

function MyComponent() {
  return (
    <div class="main-container">
      <div class="grid-layout cols-3">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Card Title</h3>
            <span class="badge badge-primary">New</span>
          </div>
          <div class="card-body">
            <p>Card content goes here</p>
          </div>
          <div class="card-footer">
            <button class="btn-primary">Action</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Support
For issues or questions, refer to the component documentation or check the CSS files directly.
