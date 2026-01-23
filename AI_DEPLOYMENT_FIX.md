# AI Backend Deployment Fix - Complete Guide

## Problem
The AI features were not working in deployment because:
1. **Hardcoded localhost URLs** in AI components
2. **Missing environment variable** configuration for backend URL
3. **No deployment instructions** for the backend server

## Solution Implemented

### 1. Fixed Hardcoded URLs in AI Components

#### AIUniversalCreatorModern.jsx
Changed from:
```javascript
fetch('http://localhost:3001/api/ai/generate', ...)
```

To:
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
fetch(`${API_URL}/api/ai/generate`, ...)
```

#### ReactCodeAI.jsx
Applied the same fix to both API calls in this component.

### 2. Updated Environment Configuration

#### Frontend (.env)
```env
# For local development:
VITE_API_BASE_URL=http://localhost:3001

# For production (set in Vercel):
# VITE_API_BASE_URL=https://your-backend.onrender.com
```

#### Backend (backend-new/.env)
```env
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

## Deployment Steps

### Option 1: Deploy Backend to Render.com (Recommended)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: codex-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend-new
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the service URL (e.g., `https://codex-backend.onrender.com`)

### Option 2: Deploy Backend to Railway.app

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Root directory: `backend-new`
   - Add environment variables (same as above)

4. **Deploy**
   - Railway will auto-deploy
   - Copy the generated URL

### Option 3: Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create codex-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   ```bash
   cd backend-new
   git init
   heroku git:remote -a codex-backend
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## Frontend Deployment (Vercel)

### 1. Update Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_BASE_URL = https://your-backend.onrender.com
GEMINI_API_KEY = AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
```

**Important:** Replace `https://your-backend.onrender.com` with your actual backend URL from Render/Railway/Heroku.

### 2. Redeploy Frontend

After adding environment variables:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

Or push a new commit to trigger auto-deployment.

## Testing the Deployment

### 1. Test Backend Health
```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-23T..."
}
```

### 2. Test AI Generation
```bash
curl -X POST https://your-backend.onrender.com/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple button", "outputType": "web"}'
```

### 3. Test Frontend AI
1. Open your deployed app
2. Navigate to AI Creator section
3. Try generating code
4. Check browser console for errors

## Troubleshooting

### Issue: "Failed to fetch" Error

**Cause:** CORS not configured properly

**Fix:** Update `backend-new/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Issue: "API key not configured"

**Cause:** Environment variable not set in backend

**Fix:** 
1. Check Render/Railway dashboard
2. Verify `GEMINI_API_KEY` is set
3. Restart the service

### Issue: "Rate limit exceeded"

**Cause:** Gemini API quota exceeded

**Fix:**
1. Check quota at https://makersuite.google.com/app/apikey
2. The backend has fallback templates that work without API
3. Consider upgrading Gemini API plan

### Issue: Backend not responding

**Cause:** Service might be sleeping (free tier)

**Fix:**
- Render free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Consider upgrading to paid tier for always-on

## Backend Health Check Endpoint

The backend includes a health check endpoint:

```javascript
// GET /health
{
  "status": "ok",
  "timestamp": "2026-01-23T12:00:00.000Z",
  "geminiConfigured": true
}
```

Use this to monitor backend status.

## Cost Considerations

### Free Tier Options

1. **Render.com**
   - ✅ Free tier available
   - ⚠️ Sleeps after 15 min inactivity
   - ⚠️ 750 hours/month limit
   - ✅ Easy deployment

2. **Railway.app**
   - ✅ $5 free credit/month
   - ✅ No sleep
   - ⚠️ Credit runs out quickly
   - ✅ Very fast deployment

3. **Heroku**
   - ❌ No free tier anymore
   - ✅ Reliable
   - ⚠️ $7/month minimum

### Gemini API Costs
- **Free tier:** 1,500 requests/day (gemini-1.5-flash)
- **Paid tier:** $0.00025 per request
- Current implementation uses gemini-1.5-flash for higher quota

## Files Modified

1. ✅ `src/components/AI/AIUniversalCreatorModern.jsx` - Fixed hardcoded URLs
2. ✅ `src/components/AI/ReactCodeAI.jsx` - Fixed hardcoded URLs
3. ✅ `.env` - Updated with deployment instructions
4. ✅ `backend-new/.env` - Production configuration

## Quick Start Commands

### Local Development
```bash
# Terminal 1 - Backend
cd backend-new
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

### Production Check
```bash
# Check if backend is live
curl https://your-backend.onrender.com/health

# Check environment variables
echo $VITE_API_BASE_URL
```

## Next Steps

1. ✅ Deploy backend to Render/Railway/Heroku
2. ✅ Copy backend URL
3. ✅ Add `VITE_API_BASE_URL` to Vercel
4. ✅ Redeploy frontend
5. ✅ Test AI features
6. ✅ Monitor backend logs

## Support

If you encounter issues:
1. Check backend logs in Render/Railway dashboard
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test backend health endpoint
5. Check CORS configuration

---
**Status:** Ready for deployment ✅
**Last Updated:** January 23, 2026
