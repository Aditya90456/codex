# AI Code Explainer - Vercel Deployment Fix

## Problem
The AI Code Explainer feature is not working on Vercel because:
1. Frontend is deployed on Vercel (static hosting)
2. Backend needs to be deployed separately (Vercel doesn't support Node.js backend in free tier easily)
3. Environment variable `VITE_BACKEND_URL` needs to point to deployed backend

## Solution Overview

### Step 1: Deploy Backend to Render.com (Free)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `codex-backend` (or your choice)
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables in Render**
   ```
   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://codex-backend-xxxx.onrender.com`

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Select your project
   - Go to "Settings" → "Environment Variables"

2. **Add/Update Variables**
   ```
   VITE_BACKEND_URL=https://codex-backend-xxxx.onrender.com
   VITE_API_BASE_URL=https://codex-backend-xxxx.onrender.com
   ```

3. **Redeploy**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 3: Test the Feature

1. **Open your Vercel app**
   - Go to DSA section
   - Write some code
   - Click "Explain My Code"

2. **Check Browser Console**
   - Press F12
   - Look for network requests to your backend
   - Should see successful requests to Render backend

## Local Development Setup

### Using Original Backend (Recommended)

1. **Start Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Verify Backend is Running**
   ```bash
   # Test health endpoint
   curl http://localhost:3001/health
   
   # Or run test script
   node test-explain-original.js
   ```

3. **Start Frontend**
   ```bash
   # In root directory
   npm run dev
   ```

4. **Environment Variables**
   - `.env` should have:
     ```
     VITE_BACKEND_URL=http://localhost:3001
     VITE_API_BASE_URL=http://localhost:3001
     ```

## Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:3001/health

# Should return:
# {"status":"OK","timestamp":"...","version":"1.0.0","geminiConfigured":true}
```

### CORS Errors
- Backend already configured to allow Vercel domains
- Check `backend/server.js` CORS configuration
- Ensure your Vercel domain is in allowed origins

### Gemini API Errors
```bash
# Test Gemini API key
node test-gemini-api.js

# If quota exceeded, get new key from:
# https://makersuite.google.com/app/apikey
```

### Frontend Can't Connect
1. Check browser console for errors
2. Verify `VITE_BACKEND_URL` is set correctly
3. Make sure backend URL is accessible (not localhost in production)

## Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  Static Files   │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  Render.com     │
│  (Backend)      │
│  Node.js Server │
│  Port 3001      │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  Google         │
│  Gemini API     │
│  AI Service     │
└─────────────────┘
```

## Quick Commands

```bash
# Test backend locally
cd backend && npm start

# Test AI explainer
node test-explain-original.js

# Test Gemini API
node test-gemini-api.js

# Deploy backend to Render
# (Use Render dashboard - no CLI needed)

# Redeploy Vercel
# (Use Vercel dashboard or)
vercel --prod
```

## Files Modified

- `.env` - Updated to use original backend (port 3001)
- `backend/server.js` - Already has CORS configured
- `backend/routes/code-explainer.js` - AI explainer route
- `src/components/AI/AICodeExplainer.jsx` - Frontend component

## Cost

- **Render.com Free Tier**: 
  - 750 hours/month (enough for 24/7)
  - Spins down after 15 min inactivity
  - First request after sleep takes ~30 seconds

- **Vercel Free Tier**:
  - Unlimited bandwidth
  - 100 GB-hours compute

- **Gemini API**:
  - Free tier: 60 requests/minute
  - Upgrade if needed

## Next Steps

1. ✅ Backend configured (original backend at port 3001)
2. ⏳ Deploy backend to Render.com
3. ⏳ Update Vercel environment variables
4. ⏳ Test on production

## Support

If issues persist:
1. Check backend logs on Render
2. Check browser console on Vercel
3. Verify all environment variables are set
4. Test with `test-explain-original.js` locally first
