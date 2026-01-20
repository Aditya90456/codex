# Codex Logo Guide

## Available Logo Files

1. **codex-logo.svg** - Full logo with "CODEX" text
2. **codex-icon-only.svg** - Icon-only version (no text)
3. **codex-icon.svg** - Existing icon (if present)

## Logo Design

The Codex logo features:
- **Gradient Background**: Purple to pink gradient (modern, tech-focused)
- **Code Brackets**: White brackets `{ }` representing code structure
- **Code Symbols**: Cyan gradient `</> ` symbols in the center
- **Accent Dots**: Yellow and green dots for visual interest
- **Glow Effect**: Subtle glow for depth and modern feel

## Converting SVG to PNG

### Method 1: Online Converters (Easiest)
1. Visit: https://cloudconvert.com/svg-to-png
2. Upload `codex-logo.svg` or `codex-icon-only.svg`
3. Set dimensions (recommended: 512x512, 1024x1024, or 2048x2048)
4. Download the PNG file

### Method 2: Using Inkscape (Best Quality)
```bash
# Install Inkscape
# Windows: Download from https://inkscape.org/
# Mac: brew install inkscape
# Linux: sudo apt-get install inkscape

# Convert to PNG
inkscape codex-logo.svg --export-type=png --export-filename=logo.png --export-width=512
inkscape codex-logo.svg --export-type=png --export-filename=logo@2x.png --export-width=1024
```

### Method 3: Using ImageMagick
```bash
# Install ImageMagick
# Windows: Download from https://imagemagick.org/
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert to PNG
convert -background none codex-logo.svg -resize 512x512 logo.png
convert -background none codex-logo.svg -resize 1024x1024 logo@2x.png
```

### Method 4: Using Node.js (sharp)
```bash
npm install sharp

# Create convert.js
const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('codex-logo.svg');

sharp(svg)
  .resize(512, 512)
  .png()
  .toFile('logo.png');
```

### Method 5: Using Browser DevTools
1. Open `codex-logo.svg` in a browser
2. Right-click and "Inspect Element"
3. In Console, run:
```javascript
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, 512, 512);
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo.png';
    a.click();
  });
};
img.src = 'codex-logo.svg';
```

## Recommended Sizes

### Web Usage
- **Favicon**: 16x16, 32x32, 48x48
- **App Icon**: 192x192, 512x512
- **Social Media**: 1200x1200 (square), 1200x630 (og:image)
- **Retina Displays**: 2x versions (1024x1024, 2048x2048)

### Mobile Apps
- **iOS**: 180x180 (iPhone), 167x167 (iPad)
- **Android**: 192x192, 512x512

## Usage in Your App

### Update index.html
```html
<link rel="icon" type="image/svg+xml" href="/codex-icon-only.svg" />
<link rel="icon" type="image/png" href="/logo.png" />
<link rel="apple-touch-icon" href="/logo.png" />
```

### Update manifest.json (if you have one)
```json
{
  "icons": [
    {
      "src": "/logo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Use in React Components
```jsx
import logo from '/codex-logo.svg';

function Header() {
  return <img src={logo} alt="Codex Logo" className="w-12 h-12" />;
}
```

## Color Palette

### Primary Colors
- **Purple**: #667eea
- **Deep Purple**: #764ba2
- **Pink**: #f093fb

### Accent Colors
- **Cyan**: #4facfe
- **Light Cyan**: #00f2fe
- **Yellow**: #fbbf24
- **Green**: #34d399

### Usage
- **Background**: Gradient from purple to pink
- **Code Elements**: Cyan gradient
- **Accents**: Yellow and green dots
- **Text/Brackets**: White (#ffffff)

## Customization

To customize the logo, edit the SVG files:

1. **Change Colors**: Modify the gradient stops
2. **Adjust Size**: Change viewBox dimensions
3. **Remove Elements**: Delete unwanted paths/circles
4. **Add Effects**: Add more filters or gradients

## Brand Guidelines

### Do's
✅ Use on dark or light backgrounds
✅ Maintain aspect ratio
✅ Use SVG when possible for scalability
✅ Provide adequate spacing around logo

### Don'ts
❌ Don't distort or stretch
❌ Don't change colors drastically
❌ Don't add drop shadows (already has glow)
❌ Don't place on busy backgrounds

## File Naming Convention

- `logo.png` - Standard logo (512x512)
- `logo@2x.png` - Retina version (1024x1024)
- `logo-icon.png` - Icon only (no text)
- `logo-white.png` - White version for dark backgrounds
- `logo-dark.png` - Dark version for light backgrounds

## Quick Start

1. Choose your preferred conversion method above
2. Convert `codex-logo.svg` to `logo.png` at 512x512
3. Create a 2x version at 1024x1024 for retina displays
4. Replace existing logo files in your project
5. Update references in HTML/React components

## Support

For logo customization or questions:
- Check the SVG files in `/public` folder
- Modify gradients and colors as needed
- Use online SVG editors like https://editor.method.ac/

---

**Created**: January 20, 2026
**Version**: 1.0.0
**License**: MIT (for Codex Platform use)
