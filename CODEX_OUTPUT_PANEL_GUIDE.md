# Codex Editor - Output Panel Quick Guide

## 🎯 What is the Output Panel?

The Output Panel is a live preview window that shows the visual result of your HTML and JavaScript code in real-time. Think of it as a mini-browser inside your editor!

---

## 🚀 How to Use

### Step 1: Open the Output Panel
Click the **"Output"** button in the toolbar (green button with an eye icon 👁️)

### Step 2: Write Your Code
Write HTML, CSS, or JavaScript code in the editor

### Step 3: Run Your Code
Click the **"Run Code"** button (green play button ▶️)

### Step 4: See the Results
Your code's visual output appears in the Output Panel!

---

## 📋 Layout Options

### Option 1: Editor + Output (Recommended for Web Development)
- Editor: 66% width
- Output: 33% width
- Perfect for HTML/CSS work

**How to activate:**
1. Click "Output" button (ON)
2. Click "Analysis" button (OFF)

### Option 2: Editor + Analysis (Recommended for Code Review)
- Editor: 66% width
- Analysis: 33% width
- Perfect for code quality checks

**How to activate:**
1. Click "Analysis" button (ON)
2. Click "Output" button (OFF)

### Option 3: Three-Panel View (Full IDE Experience)
- Editor: 33% width
- Output: 33% width
- Analysis: 33% width
- Perfect for comprehensive development

**How to activate:**
1. Click "Output" button (ON)
2. Click "Analysis" button (ON)

### Option 4: Editor Only (Maximum Focus)
- Editor: 100% width
- Perfect for focused coding

**How to activate:**
1. Click "Output" button (OFF)
2. Click "Analysis" button (OFF)

---

## 💡 Example Use Cases

### Use Case 1: HTML Page Preview
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
    }
    .card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }
    h1 {
      color: #667eea;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Hello, Codex!</h1>
    <p>This is a live preview!</p>
  </div>
</body>
</html>
```

**Result**: Beautiful gradient page with centered card

---

### Use Case 2: Interactive Button
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 10px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    #counter {
      font-size: 24px;
      margin-top: 20px;
      color: #667eea;
    }
  </style>
</head>
<body>
  <button onclick="incrementCounter()">Click Me!</button>
  <div id="counter">Clicks: 0</div>
  
  <script>
    let count = 0;
    function incrementCounter() {
      count++;
      document.getElementById('counter').textContent = 'Clicks: ' + count;
    }
  </script>
</body>
</html>
```

**Result**: Interactive button with click counter

---

### Use Case 3: JavaScript Visualization
```javascript
// Fibonacci sequence with visual output
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("🔢 Fibonacci Sequence:");
console.log("━━━━━━━━━━━━━━━━━━━━");

for (let i = 0; i < 10; i++) {
  const result = fibonacci(i);
  console.log(`F(${i}) = ${result}`);
}

console.log("━━━━━━━━━━━━━━━━━━━━");
console.log("✅ Calculation complete!");
```

**Result**: Styled output with gradient background showing Fibonacci numbers

---

### Use Case 4: CSS Animation Demo
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #1a1a2e;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .spinner {
      width: 60px;
      height: 60px;
      border: 5px solid rgba(102, 126, 234, 0.3);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .text {
      color: white;
      font-family: Arial, sans-serif;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div>
    <div class="spinner"></div>
    <div class="text">Loading...</div>
  </div>
</body>
</html>
```

**Result**: Animated loading spinner

---

## 🎨 Output Panel Features

### Visual Features
- ✨ **Gradient Backgrounds**: Beautiful purple gradients
- 🎯 **Glass Morphism**: Modern backdrop blur effects
- 📦 **Styled Containers**: Clean, organized output
- 🌈 **Color Coding**: Different colors for different output types
- 📱 **Responsive**: Adapts to panel size

### Functional Features
- 🔄 **Live Updates**: See changes instantly
- 🧹 **Clear Button**: Reset output with one click
- ❌ **Close Button**: Hide panel when not needed
- 🔒 **Secure**: Sandboxed iframe for safety
- ⚡ **Fast**: Optimized rendering

---

## 🎯 Best Practices

### DO ✅
- Use Output panel for HTML/CSS/JavaScript
- Test interactive elements in real-time
- Clear output before running new code
- Use three-panel view for full development
- Toggle panels based on your workflow

### DON'T ❌
- Don't run infinite loops (will freeze output)
- Don't expect output for non-web languages
- Don't forget to click "Run" after code changes
- Don't use for large file uploads
- Don't rely on external resources (may not load)

---

## 🔧 Troubleshooting

### Problem: Output panel is blank
**Solution**: Click the "Run Code" button to execute your code

### Problem: HTML not rendering
**Solution**: Make sure you selected "HTML" language and clicked "Run"

### Problem: JavaScript not showing output
**Solution**: Use `console.log()` to generate output

### Problem: Panel too small
**Solution**: Close Analysis panel to give Output more space

### Problem: Interactive elements not working
**Solution**: Make sure your JavaScript is inside `<script>` tags

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Run Code | (Click button) |
| Toggle Output | (Click button) |
| Clear Output | (Click button) |
| Focus Editor | Click in editor |

---

## 🎓 Learning Tips

### For Beginners
1. Start with simple HTML
2. Add CSS styling gradually
3. Test each change by clicking "Run"
4. Use console.log() to debug
5. Experiment with examples above

### For Advanced Users
1. Use three-panel view for full workflow
2. Combine with Analysis panel for code quality
3. Test responsive designs
4. Debug with Console panel
5. Create interactive demos

---

## 📊 Supported Output Types

### Fully Supported ✅
- HTML pages
- CSS styling
- JavaScript execution
- DOM manipulation
- Interactive elements
- Console output visualization

### Partially Supported ⚠️
- External resources (may not load)
- Complex animations (performance varies)
- Large datasets (may be slow)

### Not Supported ❌
- Server-side code (PHP, Python, etc.)
- File system access
- Network requests to external APIs
- WebGL (may not work in sandbox)

---

## 🚀 Pro Tips

### Tip 1: Quick Preview
Write HTML → Click Run → Instant preview!

### Tip 2: Live Editing
Keep Output panel open while coding for live feedback

### Tip 3: Debug Visually
Use Output panel to see what your code actually produces

### Tip 4: Learn by Doing
Copy examples, modify them, see results immediately

### Tip 5: Share Your Work
Output panel shows exactly what others will see

---

## 📱 Mobile/Responsive Testing

While the Output panel shows your code's output, remember:
- Output is rendered in a fixed-size iframe
- For true responsive testing, use browser dev tools
- Test different screen sizes separately
- Consider using media queries in your CSS

---

## 🎉 Summary

The Output Panel transforms Codex into a complete web development environment:
- **See results instantly** with live preview
- **Test interactivity** with real-time execution
- **Learn faster** with visual feedback
- **Build confidently** with immediate validation

**Start using it now!** Click the "Output" button and run your first HTML page! 🚀

---

**Happy Coding!** 💻✨
