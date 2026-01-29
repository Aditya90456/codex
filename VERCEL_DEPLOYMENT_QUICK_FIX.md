# Vercel Deployment - Quick Fix for AI Explainer

## The Problem
AI Code Explainer doesn't work on Vercel because it needs a backend server.

## The Solution (5 Minutes)

### Step 1: Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `codex-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Add Environment Variables:
   ```
   GEMINI_API_KEY = AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   PORT = 3001
   NODE_ENV = production
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (~2 minutes)
8. **Copy the URL** (e.g., `https://codex-backend-xyz.onrender.com`)

### Step 2: Update Vercel

1. Go to https://vercel.com → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   ```
   Name: VITE_BACKEND_URL
   Value: https://codex-backend-xyz.onrender.com
   ```
   (Use the URL you copied from Render)

4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

### Step 3: Update Backend CORS

Add your Vercel URL to the backend CORS configuration:

```javascript
// backend/server.js - line ~12
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',  // ← Add your Vercel URL here
  /\.vercel\.app$/,
  // ... rest
];
```

Commit and push this change. Render will auto-deploy.

### Step 4: Test

1. Visit your Vercel app
2. Go to `/dsa-ai`
3. Select a problem
4. Write code
5. Click **"Explain My Code"**
6. ✅ Should work!

## Alternative: Disable AI Explainer Temporarily

If you want to deploy without the AI explainer:

The component now shows a helpful message when backend is not configured. Just deploy without setting `VITE_BACKEND_URL`.

## Troubleshooting

### "Failed to connect to AI service"
- Check backend is running on Render
- Verify `VITE_BACKEND_URL` is set in Vercel
- Make sure you redeployed after adding the variable

### "CORS policy blocked"
- Add your Vercel URL to `allowedOrigins` in `backend/server.js`
- Push the change to trigger Render redeploy

### Backend is slow
- Render free tier sleeps after 15 min of inactivity
- First request takes ~30 seconds to wake up
- This is normal for free tier

## Cost
- **Vercel:** Free
- **Render:** Free (with sleep)
- **Gemini API:** Free (60 req/min)
- **Total:** $0/month

## Need Help?
See `AI_EXPLAINER_VERCEL_FIX.md` for detailed instructions.

---
**Time to fix:** 5-10 minutes
**Difficulty:** Easy
**Status:** ✅ Ready to deploy
