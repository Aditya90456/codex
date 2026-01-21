# Backend Server Startup Guide

## Quick Start

### Option 1: Using the Startup Script (Easiest)
```bash
cd backend-new
start-backend.bat
```

### Option 2: Using npm
```bash
cd backend-new
npm start
```

### Option 3: Manual Start
```bash
cd backend-new
node server.js
```

## First Time Setup

If this is your first time running the backend:

### 1. Install Dependencies
```bash
cd backend-new
npm install
```

This will install all required packages (Express, CORS, etc.)

### 2. Create .env File (Optional)
```bash
cd backend-new
copy .env.example .env
```

Then edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Start the Server
```bash
npm start
```

## Verify Server is Running

You should see:
```
🚀 Codex Playground Backend v2.0.0 running on port 3001
📊 Health check: http://localhost:3001/health
📚 API docs: http://localhost:3001/api
🌍 Environment: development
```

## Test the Server

### Test Health Endpoint
Open browser: http://localhost:3001/health

Or use curl:
```bash
curl http://localhost:3001/health
```

### Test AI Generator
```bash
curl -X POST http://localhost:3001/api/ai/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Calculator app\",\"outputType\":\"web\"}"
```

## Troubleshooting

### Error: "Cannot find module 'express'"
**Solution**: Install dependencies
```bash
cd backend-new
npm install
```

### Error: "Port 3001 is already in use"
**Solution**: Kill the process using port 3001
```bash
# Find process
netstat -ano | findstr :3001

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Error: "ENOENT: no such file or directory"
**Solution**: Make sure you're in the backend-new directory
```bash
cd backend-new
npm start
```

### AI Generator Returns "Using fallback"
**Solution**: Add Gemini API key to `.env`
```env
GEMINI_API_KEY=your_actual_key_here
```

## Running Both Frontend and Backend

### Terminal 1 (Backend):
```bash
cd backend-new
npm start
```

### Terminal 2 (Frontend):
```bash
npm run dev
```

## Development Mode (Auto-restart)

For development with auto-restart on file changes:
```bash
cd backend-new
npm run dev
```

This uses nodemon to automatically restart when you edit files.

## Environment Variables

Create `backend-new/.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Google Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Database (Optional)
MONGODB_URI=mongodb://localhost:27017/codex-playground

# Clerk Authentication (Optional)
CLERK_SECRET_KEY=your_clerk_secret_key

# CORS
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

Once running, available endpoints:

- `GET /health` - Server health check
- `GET /api` - API documentation
- `POST /api/ai/generate` - AI content generation
- `POST /api/execute` - Code execution
- `GET /api/problems` - Get problems
- And more...

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

## Common Issues

### Issue: Backend starts but AI Creator doesn't work
**Check**:
1. Backend is running on port 3001
2. Frontend is making requests to correct URL
3. Check browser console for errors
4. Check backend terminal for errors

### Issue: CORS errors in browser
**Solution**: Make sure CORS is configured in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Database connection errors
**Solution**: Database is optional. The server will run without it:
```
⚠️  Database: Not connected (running in offline mode)
```

## Production Deployment

For production:
```bash
cd backend-new
npm start
```

Set environment variables:
```env
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your_production_key
```

## Need Help?

1. Check backend terminal for error messages
2. Check `backend-new/server.js` for configuration
3. Verify all dependencies are installed
4. Make sure port 3001 is not in use
5. Check firewall settings

---

**Server should be running on**: http://localhost:3001
**Frontend should connect to**: http://localhost:3001/api/ai/generate
