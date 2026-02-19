# AI Code Completion Setup Guide

## 📦 Installation

The AI code completion feature requires the Google Generative AI package.

### Step 1: Install the Package

Run this command in your terminal:

```bash
npm install @google/generative-ai
```

Or with yarn:

```bash
yarn add @google/generative-ai
```

### Step 2: Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Add API Key to Environment

Add to your `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## ✅ Verification

After installation, you should see:
- 🟢 "AI Complete" button in the editor header (purple/blue gradient)
- The button will be active when the package is installed
- Suggestions will appear as you type

## 🚀 Usage

### Automatic Suggestions
1. Start typing code in the editor
2. After a brief pause (800ms), AI will suggest completions
3. Suggestions appear in a floating widget at the bottom-right

### Accepting Suggestions
- Press **Tab** to accept the suggestion
- Press **Esc** to dismiss the suggestion
- Click "Accept" button in the widget
- Click "Dismiss" button to close

### Toggle AI Completion
- Click the "AI Complete" button in the editor header
- Purple/blue gradient = ON
- Gray = OFF

## 🎯 Features

### Smart Context Awareness
- Analyzes 10 lines before cursor
- Understands current problem context
- Matches your coding style
- Language-specific suggestions

### Completion Types
1. **Line Completion** - Completes current statement
2. **Multi-line** - Suggests function bodies, loops
3. **Parameter Hints** - Suggests function parameters
4. **Structure Completion** - Completes if/for/while blocks

### Caching
- Frequently used completions are cached
- 5-minute cache validity
- Up to 100 cached completions
- Faster response for repeated patterns

## ⚙️ Configuration

### Debounce Delay
Default: 800ms (time to wait after typing stops)

To change, modify in `useAICodeCompletion.js`:
```javascript
debounceDelay: 800, // milliseconds
```

### Auto-hide Delay
Default: 5000ms (suggestion auto-dismisses after 5 seconds)

To change:
```javascript
autoAcceptDelay: 5000, // milliseconds
```

### Temperature
Default: 0.2 (more deterministic code)

To change in `aiCodeCompletion.js`:
```javascript
temperature: 0.2, // 0.0 = deterministic, 1.0 = creative
```

## 🔧 Troubleshooting

### "AI Complete" button is grayed out
- Package not installed: Run `npm install @google/generative-ai`
- Missing API key: Add `VITE_GEMINI_API_KEY` to `.env`
- Restart dev server after changes

### No suggestions appearing
- Check browser console for errors
- Verify API key is valid
- Check internet connection
- Try toggling AI completion off/on

### Suggestions are slow
- First request initializes the model (slower)
- Subsequent requests use cache (faster)
- Check network speed
- Consider increasing debounce delay

### Wrong language suggestions
- Verify language selector matches your code
- Clear cache: Toggle AI completion off/on
- Problem context helps - make sure problem is loaded

## 💡 Tips

### Best Practices
1. **Let it learn**: Type a few lines first to establish context
2. **Use descriptive names**: Better variable names = better suggestions
3. **Add comments**: Comments help AI understand intent
4. **Problem context**: AI uses problem description for better suggestions

### When to Use
- ✅ Boilerplate code (loops, conditions)
- ✅ Common patterns (array operations, string manipulation)
- ✅ Function signatures
- ✅ Error handling blocks
- ❌ Complex algorithms (review carefully)
- ❌ Problem-specific logic (understand before accepting)

### Keyboard Workflow
1. Type code naturally
2. Wait for suggestion (purple sparkle icon)
3. Review suggestion in widget
4. Press **Tab** to accept or **Esc** to dismiss
5. Continue coding

## 📊 Performance

### Resource Usage
- Minimal memory footprint
- Cached completions reduce API calls
- Debouncing prevents excessive requests
- Async operations don't block editor

### API Limits
- Google AI Studio: Free tier available
- Rate limits apply (check Google AI docs)
- Cache helps reduce API usage
- Failed requests don't break editor

## 🎨 UI Elements

### AI Complete Button
```
┌──────────────────┐
│ ✨ AI Complete  │  ← Purple/blue when ON
└──────────────────┘
```

### Suggestion Widget
```
┌────────────────────────────┐
│ ✨ AI Suggestion      ✕   │
├────────────────────────────┤
│ ⏳ Generating...           │
│                            │
│ OR                         │
│                            │
│ ┌────────────────────────┐ │
│ │ for (let i = 0; i <   │ │
│ │   nums.length; i++) {  │ │
│ │   // process element   │ │
│ └────────────────────────┘ │
│                            │
│ [ ✓ Accept ]  [ Dismiss ] │
│                            │
│ Tab Accept  Esc Dismiss    │
└────────────────────────────┘
```

## 🔐 Security

### API Key Safety
- Never commit `.env` file
- Add `.env` to `.gitignore`
- Use environment variables only
- Rotate keys periodically

### Code Privacy
- Code sent to Google AI for processing
- Review Google AI privacy policy
- Don't use for sensitive/proprietary code
- Consider self-hosted alternatives for production

## 🚀 Advanced

### Custom Prompts
Modify `generatePrompt()` in `aiCodeCompletion.js` to customize:
- Context window size
- Instruction style
- Output format
- Language-specific hints

### Multiple Models
Switch between models in `initialize()`:
```javascript
model: 'gemini-pro',        // Default
model: 'gemini-pro-vision', // For image context
```

### Offline Mode
AI completion gracefully degrades:
- No package = Feature disabled
- No API key = Feature disabled
- No internet = Monaco's built-in suggestions

## 📚 Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Generative AI Docs](https://ai.google.dev/docs)
- [API Reference](https://ai.google.dev/api/rest)
- [Best Practices](https://ai.google.dev/docs/best_practices)

## 🎯 Next Steps

After setup:
1. ✅ Install package
2. ✅ Add API key
3. ✅ Restart server
4. ✅ Toggle AI completion ON
5. ✅ Start coding and watch suggestions appear!

Enjoy your AI-powered coding experience! 🚀
