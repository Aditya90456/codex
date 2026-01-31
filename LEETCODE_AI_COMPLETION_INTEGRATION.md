# LeetCode Editor - AI Code Completion Integration

## Quick Integration Guide

Add AI-powered code completion to your LeetCode editor in 3 simple steps:

### Step 1: Import the Hook and Component

Add these imports to `src/components/LeetCodeEditor.jsx`:

```javascript
import { useCodeCompletion } from '../hooks/useCodeCompletion';
import CodeCompletionPanel from './CodeCompletionPanel';
```

### Step 2: Initialize the Hook

Add this inside your LeetCodeEditor component (after the existing useState declarations):

```javascript
// AI Code Completion
const {
  suggestions,
  isLoading: isLoadingCompletions,
  requestCompletions,
  clearSuggestions
} = useCodeCompletion(language, true);

const [completionPanelPosition, setCompletionPanelPosition] = useState({ top: 0, left: 0 });
const [showCompletions, setShowCompletions] = useState(false);
```

### Step 3: Add Completion Logic to Editor

Update your `handleEditorChange` function:

```javascript
const handleEditorChange = (value) => {
  setCode(value || '');
  
  // Get cursor position from Monaco editor
  if (editorRef.current) {
    const position = editorRef.current.getPosition();
    const model = editorRef.current.getModel();
    
    if (position && model) {
      const offset = model.getOffsetAt(position);
      
      // Request AI completions
      requestCompletions(
        value || '',
        offset,
        `Solving: ${selectedProblem.title}`,
        600 // 600ms debounce
      );
      
      // Calculate panel position
      const coords = editorRef.current.getScrolledVisiblePosition(position);
      if (coords) {
        setCompletionPanelPosition({
          top: coords.top + coords.height + 100, // Adjust for editor offset
          left: coords.left + 50
        });
      }
      
      setShowCompletions(true);
    }
  }
};
```

### Step 4: Handle Suggestion Selection

Add this function:

```javascript
const handleSuggestionSelect = (suggestion) => {
  if (editorRef.current) {
    const position = editorRef.current.getPosition();
    const model = editorRef.current.getModel();
    
    if (position && model) {
      // Insert suggestion at cursor
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      };
      
      editorRef.current.executeEdits('', [{
        range: range,
        text: suggestion.text
      }]);
      
      // Move cursor to end of inserted text
      const newPosition = {
        lineNumber: position.lineNumber,
        column: position.column + suggestion.text.length
      };
      editorRef.current.setPosition(newPosition);
      editorRef.current.focus();
    }
  }
  
  clearSuggestions();
  setShowCompletions(false);
};
```

### Step 5: Add the Completion Panel to JSX

Add this component right after your Monaco Editor component:

```jsx
{/* AI Code Completion Panel */}
<CodeCompletionPanel
  suggestions={suggestions}
  isLoading={isLoadingCompletions}
  onSelect={handleSuggestionSelect}
  position={completionPanelPosition}
  visible={showCompletions && suggestions.length > 0}
/>
```

### Step 6: Add Keyboard Shortcuts (Optional)

Add this to your `handleEditorDidMount` function:

```javascript
const handleEditorDidMount = (editor) => {
  editorRef.current = editor;
  
  // Add keyboard shortcut for completions
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
    const position = editor.getPosition();
    const model = editor.getModel();
    
    if (position && model) {
      const offset = model.getOffsetAt(position);
      const value = model.getValue();
      
      // Force request completions
      requestCompletions(value, offset, `Solving: ${selectedProblem.title}`, 0);
      setShowCompletions(true);
    }
  });
  
  // Escape to close completions
  editor.addCommand(monaco.KeyCode.Escape, () => {
    clearSuggestions();
    setShowCompletions(false);
  });
};
```

## Complete Integration Example

Here's a minimal working example showing all the pieces together:

```jsx
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useCodeCompletion } from '../hooks/useCodeCompletion';
import CodeCompletionPanel from './CodeCompletionPanel';

const LeetCodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef(null);
  
  // AI Code Completion
  const {
    suggestions,
    isLoading: isLoadingCompletions,
    requestCompletions,
    clearSuggestions
  } = useCodeCompletion(language, true);
  
  const [completionPanelPosition, setCompletionPanelPosition] = useState({ top: 0, left: 0 });
  const [showCompletions, setShowCompletions] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Ctrl+Space for completions
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      const position = editor.getPosition();
      const model = editor.getModel();
      
      if (position && model) {
        const offset = model.getOffsetAt(position);
        requestCompletions(model.getValue(), offset, 'LeetCode problem', 0);
        setShowCompletions(true);
      }
    });
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const model = editorRef.current.getModel();
      
      if (position && model) {
        const offset = model.getOffsetAt(position);
        requestCompletions(value || '', offset, 'LeetCode problem', 600);
        
        const coords = editorRef.current.getScrolledVisiblePosition(position);
        if (coords) {
          setCompletionPanelPosition({
            top: coords.top + coords.height + 100,
            left: coords.left + 50
          });
        }
        setShowCompletions(true);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      
      if (position) {
        const range = {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        };
        
        editorRef.current.executeEdits('', [{
          range: range,
          text: suggestion.text
        }]);
        
        editorRef.current.setPosition({
          lineNumber: position.lineNumber,
          column: position.column + suggestion.text.length
        });
        editorRef.current.focus();
      }
    }
    
    clearSuggestions();
    setShowCompletions(false);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
      
      <CodeCompletionPanel
        suggestions={suggestions}
        isLoading={isLoadingCompletions}
        onSelect={handleSuggestionSelect}
        position={completionPanelPosition}
        visible={showCompletions && suggestions.length > 0}
      />
    </div>
  );
};

export default LeetCodeEditor;
```

## Features You Get

### 1. **Context-Aware Suggestions**
- AI understands the problem you're solving
- Suggests relevant algorithms and data structures
- Considers the programming language

### 2. **Smart Debouncing**
- 600ms delay prevents API spam
- Automatic request cancellation
- Smooth typing experience

### 3. **Keyboard Shortcuts**
- `Ctrl+Space` (or `Cmd+Space` on Mac) - Force show completions
- `Escape` - Close completion panel
- `Tab` or Click - Accept suggestion

### 4. **Visual Feedback**
- Loading indicator while generating
- Confidence scores for each suggestion
- Type-based icons (function, variable, snippet, etc.)

### 5. **Multi-Language Support**
- Works with JavaScript, Python, Java, C++, TypeScript
- Language-specific suggestions
- Syntax-aware completions

## Customization Options

### Change Debounce Delay

```javascript
// Faster completions (more API calls)
requestCompletions(value, offset, context, 300);

// Slower completions (fewer API calls)
requestCompletions(value, offset, context, 1000);
```

### Adjust Panel Position

```javascript
setCompletionPanelPosition({
  top: coords.top + coords.height + 150, // More space below cursor
  left: coords.left + 100 // More space to the right
});
```

### Disable for Specific Languages

```javascript
const {
  suggestions,
  requestCompletions,
  clearSuggestions
} = useCodeCompletion(
  language,
  language !== 'assembly' // Disable for assembly
);
```

### Custom Context Messages

```javascript
requestCompletions(
  value,
  offset,
  `Solving ${selectedProblem.title} - ${selectedProblem.difficulty} - ${selectedProblem.category}`,
  600
);
```

## Testing

### Test the Integration

1. **Start Backend**:
```bash
cd backend
npm start
```

2. **Start Frontend**:
```bash
npm run dev
```

3. **Open LeetCode Editor**:
- Navigate to `/playground` or `/leetcode`
- Start typing code
- Wait 600ms - suggestions should appear
- Press `Ctrl+Space` to force show suggestions

### Test API Directly

```bash
curl -X POST http://localhost:3001/api/code-completion/complete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function twoSum(nums, target) {\n  const map = new ",
    "cursorPosition": 50,
    "language": "javascript",
    "context": "Solving Two Sum problem",
    "maxSuggestions": 5
  }'
```

## Troubleshooting

### Completions Not Showing
1. Check backend is running on port 3001
2. Verify `GEMINI_API_KEY` in `backend/.env`
3. Check browser console for errors
4. Ensure `useCodeCompletion` hook is initialized

### Panel Position Wrong
- Adjust the offset values in `setCompletionPanelPosition`
- Account for editor container padding/margins
- Test on different screen sizes

### Slow Performance
- Increase debounce delay
- Reduce `maxSuggestions` in API call
- Check API quota limits

## Advanced Features (Optional)

### Add Inline Ghost Text

```javascript
const { inlineCompletion, requestInlineCompletion } = useCodeCompletion(language, true);

// In handleEditorChange
requestInlineCompletion(value, offset, 800);

// Display as Monaco decoration
if (inlineCompletion && editorRef.current) {
  const position = editorRef.current.getPosition();
  editorRef.current.deltaDecorations([], [{
    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
    options: {
      after: {
        content: inlineCompletion,
        inlineClassName: 'ghost-text'
      }
    }
  }]);
}
```

### Add Completion Analytics

```javascript
const handleSuggestionSelect = (suggestion) => {
  // Track which suggestions users accept
  console.log('Accepted suggestion:', {
    text: suggestion.text,
    type: suggestion.type,
    confidence: suggestion.confidence,
    problem: selectedProblem.title
  });
  
  // Insert suggestion...
};
```

## Status: ✅ READY TO INTEGRATE

Follow the steps above to add AI code completion to your LeetCode editor!
