# AI Code Completion Troubleshooting Guide

## Issue: AI Completions Not Showing

### Quick Diagnostic Steps

#### 1. Check Backend is Running
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Should see:
# ✅ AI Generator routes mounted
# ✅ Code Explainer routes mounted  
# ✅ Code Completion routes mounted
# Server running on port 3001
```

#### 2. Check Frontend is Running
```bash
# Terminal 2 - Start frontend
npm run dev

# Should see:
# VITE v5.x.x ready in xxx ms
# Local: http://localhost:5173/
```

#### 3. Test API Directly
Open `test-completion-debug.html` in your browser or run:
```bash
node test-completion-api.js
```

Expected output:
```
✅ API is working!
Received 3 suggestions:
1. [function] Map()...
   Confidence: 85%
```

#### 4. Check Browser Console
1. Open `/playground` or `/leetcode` in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Start typing in the editor
5. Look for these logs:

```
[AI Completion] Requesting completions: {codeLength: 45, offset: 45, ...}
[AI Completion] Response received: {success: true, suggestionsCount: 3, ...}
[CodeCompletionPanel] Render: {visible: true, isLoading: false, suggestionsCount: 3, ...}
```

### Common Issues & Solutions

#### Issue 1: Backend Not Running
**Symptoms:**
- Console shows: `Failed to fetch completions`
- Network tab shows failed requests to `localhost:3001`

**Solution:**
```bash
cd backend
npm install  # If first time
npm start
```

#### Issue 2: Wrong API URL
**Symptoms:**
- Requests going to wrong URL
- CORS errors in console

**Solution:**
Check `.env` file has:
```
VITE_API_BASE_URL=http://localhost:3001
```

Then restart dev server:
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

#### Issue 3: Missing Gemini API Key
**Symptoms:**
- API returns error
- Backend logs show API key errors

**Solution:**
Check `backend/.env` has valid key:
```
GEMINI_API_KEY=AIzaSy...your_key_here
```

Get key from: https://makersuite.google.com/app/apikey

#### Issue 4: Completions Panel Not Visible
**Symptoms:**
- Console shows suggestions received
- But panel doesn't appear

**Solution:**
Check these in browser console:
```javascript
// Should see panel render logs
[CodeCompletionPanel] Render: {visible: true, suggestionsCount: 3}
```

If `visible: false`, check:
1. `showCompletions` state is true
2. `suggestions.length > 0`
3. Panel position is within viewport

#### Issue 5: Debounce Too Long
**Symptoms:**
- Have to wait too long for suggestions
- Suggestions appear after you stop typing

**Solution:**
Reduce debounce delay in `LeetCodeEditor.jsx`:
```javascript
requestCompletions(
  value || '',
  offset,
  context,
  300  // Changed from 600ms to 300ms
);
```

#### Issue 6: Panel Position Off-Screen
**Symptoms:**
- Suggestions work but panel not visible
- Console shows panel rendering

**Solution:**
Adjust position calculation in `LeetCodeEditor.jsx`:
```javascript
setCompletionPanelPosition({
  top: coords.top + coords.height + 50,  // Reduced from 100
  left: coords.left + 20  // Reduced from 50
});
```

### Debug Mode

Enable detailed logging by adding to `LeetCodeEditor.jsx`:

```javascript
// After AI Code Completion state
useEffect(() => {
  console.log('[Debug] Completion state:', {
    suggestions: suggestions.length,
    isLoading: isLoadingCompletions,
    showCompletions,
    position: completionPanelPosition
  });
}, [suggestions, isLoadingCompletions, showCompletions, completionPanelPosition]);
```

### Manual Test

Force show completions by pressing `Ctrl+Space` (or `Cmd+Space` on Mac) while cursor is in the editor.

If this works but auto-completion doesn't:
- Issue is with debouncing or change detection
- Check `handleEditorChange` is being called

### Network Tab Check

1. Open DevTools → Network tab
2. Filter by "code-completion"
3. Type in editor
4. Should see POST request to `/api/code-completion/complete`
5. Click request → Preview tab → Check response

Expected response:
```json
{
  "success": true,
  "suggestions": [
    {
      "text": "Map()",
      "type": "function",
      "confidence": 85
    }
  ]
}
```

### Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Restart both servers**: Stop and start backend + frontend
3. **Check for errors**: Look in both terminal windows
4. **Verify routes**: Check `backend/server.js` has code-completion route registered
5. **Test with curl**:
```bash
curl -X POST http://localhost:3001/api/code-completion/complete \
  -H "Content-Type: application/json" \
  -d '{"code":"const x = ","cursorPosition":10,"language":"javascript"}'
```

### Success Indicators

When working correctly, you should see:

1. **In Terminal (Backend)**:
```
POST /api/code-completion/complete 200 1234ms
```

2. **In Browser Console**:
```
[AI Completion] Requesting completions: {...}
[AI Completion] Response received: {success: true, suggestionsCount: 3}
[CodeCompletionPanel] Render: {visible: true, suggestionsCount: 3}
```

3. **In Browser**:
- Floating panel appears near cursor
- Shows 3-5 suggestions
- Each has confidence score
- Click to insert

### Performance Tips

If completions are slow:

1. **Reduce max suggestions**:
```javascript
// In useCodeCompletion.js
maxSuggestions: 3  // Changed from 5
```

2. **Increase debounce**:
```javascript
requestCompletions(value, offset, context, 800);  // Slower but fewer API calls
```

3. **Check API quota**: Gemini has rate limits

### Contact Support

If still having issues, provide:
1. Browser console logs
2. Backend terminal output
3. Network tab screenshot
4. `.env` file contents (hide API key)

## Quick Fix Commands

```bash
# Full restart
cd backend && npm start &
cd .. && npm run dev

# Test API
node test-completion-api.js

# Check logs
# Backend: Look at terminal running backend
# Frontend: Browser DevTools → Console
```
