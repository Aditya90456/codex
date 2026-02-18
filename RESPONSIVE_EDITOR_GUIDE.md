# Responsive Editor CSS Guide

## Quick Start

The editor responsive CSS system provides a complete solution for code editors across all devices.

## File Location
`src/styles/editor-responsive.css`

## Key Classes

### Container
```html
<div class="editor-container">
  <!-- Editor content -->
</div>
```

### Header/Toolbar
```html
<div class="editor-header">
  <div class="editor-toolbar">
    <button class="editor-toolbar-button">Run</button>
    <button class="editor-toolbar-button active">Save</button>
  </div>
</div>
```

### Sidebar (Problem List)
```html
<div class="editor-sidebar">
  <!-- Problems, files, etc -->
</div>
```

### Main Editor Area
```html
<div class="editor-main">
  <textarea class="code-editor"></textarea>
</div>
```

### Output Panel
```html
<div class="editor-output">
  <pre>Output here...</pre>
</div>
```

### Tabs
```html
<div class="editor-tabs">
  <button class="editor-tab active">main.js</button>
  <button class="editor-tab">utils.js</button>
</div>
```

## Responsive Behavior

### Mobile (< 768px)
- Vertical layout (sidebar on top, editor below)
- Smaller buttons and fonts
- Touch-friendly 44px minimum tap targets
- Compact toolbar with icon-only buttons

### Tablet (768px - 1023px)
- Still vertical but more spacious
- Larger fonts
- More padding

### Desktop (≥ 1024px)
- Horizontal layout (sidebar left, editor right)
- Full-size buttons with text
- Resizable panels
- Optional minimap

## Complete Example

```html
<div class="editor-container">
  <!-- Header -->
  <div class="editor-header">
    <div class="editor-toolbar">
      <button class="editor-toolbar-button">
        <span class="icon">▶</span>
        <span class="button-text">Run</span>
      </button>
      <button class="editor-toolbar-button">
        <span class="icon">💾</span>
        <span class="button-text">Save</span>
      </button>
    </div>
  </div>

  <!-- Sidebar (mobile: top, desktop: left) -->
  <div class="editor-sidebar">
    <h3>Problems</h3>
    <ul>
      <li>Two Sum</li>
      <li>Add Two Numbers</li>
    </ul>
  </div>

  <!-- Main editor -->
  <div class="editor-main">
    <div class="editor-tabs">
      <button class="editor-tab active">Solution.js</button>
    </div>
    <textarea class="code-editor" placeholder="Write code..."></textarea>
  </div>

  <!-- Output -->
  <div class="editor-output">
    <pre>Output: [0, 1]</pre>
  </div>

  <!-- Status bar -->
  <div class="editor-status-bar">
    <span class="editor-status-item">Line 1, Col 1</span>
    <span class="editor-status-item">JavaScript</span>
  </div>
</div>
```

## Tips

1. **Mobile**: Text in buttons hidden automatically, only icons show
2. **Touch targets**: All buttons are minimum 44px on mobile
3. **Fonts**: Auto-scale from 12px (mobile) to 15px (large desktop)
4. **Layout**: Automatically switches from vertical to horizontal at 1024px
5. **Scrolling**: Smooth touch scrolling enabled on all panels

## Integration

Already imported in `src/index.css`:
```css
@import './styles/editor-responsive.css';
```

Just use the classes in your components!
