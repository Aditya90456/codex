# Quick Guide: AI & React-AI Routes

## ✅ Setup Complete!

Both AI routes are now configured and ready to use in your application.

## Routes Available

### 1. AI Universal Creator - `/ai`
**Multi-format AI code generator**
- Web applications (HTML/CSS/JS)
- React applications
- React Native mobile apps
- API endpoints (Express.js)
- Documentation (Markdown)
- Data analysis scripts (Python)

### 2. React Code AI - `/react-ai`
**Specialized React code generator**
- Full React applications
- Individual components
- Custom hooks
- State management
- Quick project templates

## Quick Start

### Start Backend
```bash
cd backend-new
npm start
```
Backend runs on `http://localhost:3001`

### Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Test Everything
```bash
node test-ai-routes.js
```

## Access Routes

1. **Direct URLs:**
   - http://localhost:5173/ai
   - http://localhost:5173/react-ai

2. **From Welcome Screen:**
   - Click "AI Creator" button → `/ai`
   - Click "React AI" button → `/react-ai`

3. **From Mobile Nav:**
   - Tap "AI Creator" → `/ai`
   - Tap "React AI" → `/react-ai`

## API Endpoint

Both routes use the same backend endpoint:

```
POST http://localhost:3001/api/ai/generate
```

**Request:**
```json
{
  "prompt": "Create a todo app",
  "outputType": "react",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "content": {
    "code": "import React...",
    "type": "javascript",
    "language": "javascript"
  },
  "source": "gemini-ai",
  "timestamp": "2026-01-30T..."
}
```

## Environment Setup

Add to `backend-new/.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

Get your API key: https://makersuite.google.com/app/apikey

## Features

### AI Universal Creator
- 🎨 Multiple output formats
- 💬 Chat interface
- 📋 Copy to clipboard
- 💾 Download code
- 🔄 Fallback templates

### React Code AI
- ⚛️ React-specific generation
- 🚀 Quick project templates
- 🎯 Modern React patterns
- 📱 Responsive design
- 💾 Download as .jsx

## Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:3001/health

# Start backend
cd backend-new
npm start
```

### Routes not found
- Restart dev server: `npm run dev`
- Clear browser cache
- Check console for errors

### AI generation fails
- Check GEMINI_API_KEY in backend-new/.env
- Verify API quota at https://makersuite.google.com/app/apikey
- System will use fallback templates if AI unavailable

## Testing

Run the test suite:
```bash
node test-ai-routes.js
```

This will test:
- ✅ Backend health
- ✅ AI service health
- ✅ Web generation
- ✅ React generation
- ✅ Frontend routes

## Status: 🟢 READY

Both routes are configured and ready to use!
