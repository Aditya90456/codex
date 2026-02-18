# LeetCode Page Style Guide

## Overview
Comprehensive responsive styles for the LeetCode practice interface with three-panel layout.

## Layout Structure

### Desktop (≥1024px)
```
┌─────────────┬──────────────────┬─────────────┐
│   Problem   │                  │ Description │
│    List     │   Code Editor    │ Test Cases  │
│  (Sidebar)  │                  │   (Right)   │
└─────────────┴──────────────────┴─────────────┘
```

### Mobile (<1024px)
```
┌─────────────────────────────────┐
│        Problem List (Top)        │
├─────────────────────────────────┤
│        Code Editor (Middle)      │
├─────────────────────────────────┤
│   Description/Tests (Bottom)     │
└─────────────────────────────────┘
```

## Key Classes

### Container
```html
<div class="leetcode-container">
  <!-- All content -->
</div>
```

### Problem List Sidebar
```html
<div class="leetcode-sidebar">
  <div class="problem-list-header">
    <div class="problem-search">
      <input class="problem-search-input" placeholder="Search problems...">
    </div>
    <div class="difficulty-filter">
      <button class="difficulty-btn active">All</button>
      <button class="difficulty-btn">Easy</button>
      <button class="difficulty-btn">Medium</button>
      <button class="difficulty-btn">Hard</button>
    </div>
  </div>
  
  <div class="problem-item active">
    <span class="problem-number">1.</span>
    <span class="problem-title">Two Sum</span>
    <span class="problem-difficulty easy">Easy</span>
    <span class="problem-status solved">✓</span>
  </div>
</div>
```

### Main Editor Area
```html
<div class="leetcode-main">
  <div class="editor-tabs-container">
    <div class="editor-tabs">
      <button class="editor-tab active">Code</button>
      <button class="editor-tab">Notes</button>
    </div>
    <div class="language-selector">
      <select class="language-select">
        <option>JavaScript</option>
        <option>Python</option>
        <option>Java</option>
      </select>
    </div>
  </div>
  
  <div class="editor-area">
    <!-- Monaco Editor -->
  </div>
  
  <div class="action-buttons">
    <button class="action-btn action-btn-run">
      <PlayIcon /> Run Code
    </button>
    <button class="action-btn action-btn-submit">
      <SendIcon /> Submit
    </button>
  </div>
</div>
```

### Right Panel
```html
<div class="leetcode-right-panel">
  <div class="panel-tabs">
    <button class="panel-tab active">Description</button>
    <button class="panel-tab">Test Cases</button>
    <button class="panel-tab">Solutions</button>
  </div>
  
  <div class="panel-content">
    <div class="problem-description">
      <h2>Problem Title</h2>
      <p>Problem description...</p>
    </div>
  </div>
</div>
```

### Timer Widget
```html
<div class="timer-widget">
  <div class="timer-display">25:00</div>
  <div class="timer-controls">
    <button class="timer-btn"><PlayIcon /></button>
    <button class="timer-btn"><PauseIcon /></button>
    <button class="timer-btn"><ResetIcon /></button>
  </div>
</div>
```

## Difficulty Badges

```html
<span class="problem-difficulty easy">Easy</span>
<span class="problem-difficulty medium">Medium</span>
<span class="problem-difficulty hard">Hard</span>
```

## Test Cases

```html
<div class="test-case">
  <div class="test-case-header">
    <span class="test-case-title">Test Case 1</span>
    <span class="test-case-status passed">
      <CheckIcon /> Passed
    </span>
  </div>
  <div class="test-case-content">
    <div class="test-case-label">Input:</div>
    <div class="test-case-value">[2, 7, 11, 15], target = 9</div>
    <div class="test-case-label">Output:</div>
    <div class="test-case-value">[0, 1]</div>
  </div>
</div>
```

## Stats Panel

```html
<div class="stats-panel">
  <div class="stat-card">
    <div class="stat-value">42</div>
    <div class="stat-label">Solved</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">7</div>
    <div class="stat-label">Streak</div>
  </div>
</div>
```

## Company Selector

```html
<div class="company-selector">
  <button class="company-btn active">
    <img class="company-logo" src="google.png" alt="Google">
    <span>Google</span>
  </button>
  <button class="company-btn">
    <img class="company-logo" src="amazon.png" alt="Amazon">
    <span>Amazon</span>
  </button>
</div>
```

## Responsive Behavior

### Mobile (< 640px)
- Vertical stacking of all panels
- Problem list: 30vh height
- Editor: Flexible height
- Right panel: 25vh height
- Smaller fonts and padding
- Full-width action buttons

### Tablet (640px - 1023px)
- Still vertical but more spacious
- Problem list: 40vh height
- Right panel: 35vh height
- Larger touch targets

### Desktop (≥ 1024px)
- Three-column horizontal layout
- Resizable panels
- Problem list: 320px width (resizable 280-400px)
- Right panel: 400px width (resizable 350-500px)
- Editor takes remaining space

## Color Scheme

### Backgrounds
- **Container**: `#0a0e1a` - Main dark background
- **Panels**: `#0f1419` - Slightly lighter panels
- **Hover**: `rgba(255, 255, 255, 0.05)` - Subtle hover

### Text
- **Primary**: `#f9fafb` - Headings
- **Secondary**: `#e5e7eb` - Body text
- **Tertiary**: `#9ca3af` - Labels, placeholders

### Accents
- **Primary**: `#3b82f6` - Blue for active states
- **Success**: `#4ade80` - Green for passed/solved
- **Warning**: `#fbbf24` - Yellow for medium difficulty
- **Danger**: `#f87171` - Red for failed/hard

## Action Buttons

### Run Button
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Submit Button
```css
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
```

### Secondary Button
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## Tips

1. **Touch Targets**: All interactive elements are minimum 44px on mobile
2. **Scrolling**: Smooth touch scrolling enabled on all panels
3. **Resizable**: Desktop panels can be resized by dragging borders
4. **Sticky Headers**: Problem list and panel headers stick to top
5. **Overflow**: All panels handle overflow with custom scrollbars

## Integration

Already imported in `src/index.css`:
```css
@import './styles/leetcode-responsive.css';
```

Just use the classes in your LeetCode components!

## Example Usage

```jsx
function LeetCodeEditor() {
  return (
    <div className="leetcode-container">
      {/* Problem List */}
      <div className="leetcode-sidebar">
        {/* Problems */}
      </div>
      
      {/* Editor */}
      <div className="leetcode-main">
        <div className="editor-tabs-container">
          {/* Tabs */}
        </div>
        <div className="editor-area">
          {/* Monaco Editor */}
        </div>
        <div className="action-buttons">
          <button className="action-btn action-btn-run">Run</button>
          <button className="action-btn action-btn-submit">Submit</button>
        </div>
      </div>
      
      {/* Description/Tests */}
      <div className="leetcode-right-panel">
        <div className="panel-tabs">
          {/* Tabs */}
        </div>
        <div className="panel-content">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}
```

## Performance Notes

- Uses CSS Grid and Flexbox for efficient layouts
- Hardware-accelerated transitions
- Optimized for 4GB RAM devices
- Minimal repaints and reflows
- Efficient scrolling with `-webkit-overflow-scrolling: touch`
