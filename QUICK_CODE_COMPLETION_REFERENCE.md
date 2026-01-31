# Quick Code Completion Reference Card

## 🚀 3-Step Integration

### Step 1: Import
```jsx
import { useCodeCompletion } from '../hooks/useCodeCompletion';
import CodeCompletionPanel from './CodeCompletionPanel';
```

### Step 2: Initialize
```jsx
const {
  suggestions,
  requestCompletions,
  clearSuggestions
} = useCodeCompletion('javascript', true);
```

### Step 3: Use
```jsx
<CodeCompletionPanel
  suggestions={suggestions}
  onSelect={(s) => insertText(s.text)}
  position={{ top: 100, left: 50 }}
  visible={suggestions.length > 0}
/>
```

## 📡 API Endpoints

```
POST /api/code-completion/complete    # Get suggestions
POST /api/code-completion/inline      # Get inline completion
GET  /api/code-completion/health      # Health check
```

## 🎯 Hook API

```javascript
const {
  suggestions,              // Array of suggestions
  isLoading,               // Loading state
  inlineCompletion,        // Ghost text
  requestCompletions,      // Request suggestions
  requestInlineCompletion, // Request inline
  clearSuggestions,        // Clear all
  fetchCompletions         // Direct fetch
} = useCodeCompletion(language, enabled);
```

## 💡 Request Completions

```javascript
requestCompletions(
  code,           // Full code string
  cursorPosition, // Number (offset)
  context,        // Optional context string
  delay           // Debounce delay (ms)
);
```

## 🎨 Suggestion Object

```javascript
{
  text: "map()",              // Completion text
  description: "Array map",   // Description
  type: "function",           // Type
  confidence: 0.9             // Confidence (0-1)
}
```

## ⌨️ Keyboard Shortcuts

```javascript
// In Monaco Editor
editor.addCommand(
  monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space,
  () => requestCompletions(code, pos, '', 0)
);

editor.addCommand(
  monaco.KeyCode.Escape,
  () => clearSuggestions()
);
```

## 🔧 Configuration

```env
# backend/.env
GEMINI_API_KEY=your_key_here
PORT=3001
```

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:3001/api/code-completion/health

# Test completion
curl -X POST http://localhost:3001/api/code-completion/complete \
  -H "Content-Type: application/json" \
  -d '{"code":"const x = ","cursorPosition":10,"language":"javascript"}'
```

## 🎯 Common Patterns

### Monaco Editor
```jsx
const handleChange = (value) => {
  const pos = editorRef.current.getPosition();
  const offset = editorRef.current.getModel().getOffsetAt(pos);
  requestCompletions(value, offset);
};
```

### Textarea
```jsx
const handleChange = (e) => {
  requestCompletions(
    e.target.value,
    e.target.selectionStart
  );
};
```

### Insert Suggestion
```jsx
const handleSelect = (suggestion) => {
  // Monaco
  editorRef.current.executeEdits('', [{
    range: currentRange,
    text: suggestion.text
  }]);
  
  // Textarea
  const before = code.substring(0, cursorPos);
  const after = code.substring(cursorPos);
  setCode(before + suggestion.text + after);
};
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No suggestions | Check backend running, API key set |
| Slow | Increase debounce delay |
| Wrong position | Adjust panel offset values |
| Not working | Check browser console for errors |

## 📚 Documentation

- **Full Docs**: `AI_CODE_COMPLETION_SETUP.md`
- **LeetCode Guide**: `LEETCODE_AI_COMPLETION_INTEGRATION.md`
- **Complete Summary**: `AI_CODE_COMPLETION_COMPLETE.md`

## ✅ Checklist

- [ ] Backend running on port 3001
- [ ] GEMINI_API_KEY set in backend/.env
- [ ] Hook imported and initialized
- [ ] Panel component added to JSX
- [ ] Suggestion handler implemented
- [ ] Tested with typing

## 🚀 Status: READY TO USE!
