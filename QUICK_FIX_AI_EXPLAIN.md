# 🚀 Quick Fix: AI Explain Not Working on Vercel

## Problem
AI Code Explainer works locally but not on Vercel.

## Root Cause
Vercel hosts only the frontend (static files). The backend needs separate hosting.

## Solution (5 Minutes)

### Step 1: Start Backend Locally (Test First)
```bash
# Windows
start-original-backend.bat

# Mac/Linux
cd backend && npm start
```

### Step 2: Deploy Backend to Render.com

1. Go to https://render.com (sign up free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
     NODE_ENV=production
     ```
5. Click "Create Web Service"
6. **Copy your backend URL**: `https://codex-backend-xxxx.onrender.com`

### Step 3: Update Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   VITE_BACKEND_URL = https://codex-backend-xxxx.onrender.com
   ```
3. Go to Deployments → Click "..." → Redeploy

### Step 4: Test
- Open your Vercel app
- Go to DSA section
- Click "Explain My Code"
- Should work! 🎉

## Local Development

**Always use original backend:**
```bash
# Terminal 1: Start backend
start-original-backend.bat

# Terminal 2: Start frontend
npm run dev
```

## Files Changed
- ✅ `.env` - Now points to original backend (port 3001)
- ✅ `backend/server.js` - Has AI explainer route
- ✅ `backend/routes/code-explainer.js` - Gemini AI integration

## Why This Works

```
Local:
Frontend (localhost:5173) → Backend (localhost:3001) → Gemini API

Production:
Frontend (Vercel) → Backend (Render) → Gemini API
```

## Cost
- **Render**: Free (750 hours/month)
- **Vercel**: Free
- **Gemini API**: Free (60 req/min)

## Troubleshooting

**Backend won't start locally:**
```bash
cd backend
npm install
npm start
```

**Still not working on Vercel:**
1. Check Vercel environment variables are saved
2. Redeploy after adding variables
3. Check browser console (F12) for errors
4. Verify backend URL is accessible (not localhost)

**Gemini API errors:**
- Check quota: https://makersuite.google.com/app/apikey
- Get new key if needed

## Quick Test
```bash
# Test backend locally
node test-explain-original.js
```

## Full Documentation
See `AI_EXPLAIN_SETUP_COMPLETE.md` for detailed guide.

---
**TL;DR**: Deploy backend to Render.com (free), add backend URL to Vercel env vars, redeploy. Done! ✅
