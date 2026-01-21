# Complete Render.com Deployment Guide

## Prerequisites
- GitHub account with your code pushed
- Render.com account (free tier available)
- Clerk account with API keys
- Gemini API key

## Step 1: Prepare Your Repository

### Ensure these files are in your repo:
- ✅ `render.yaml` (deployment configuration)
- ✅ `backend-new/.env` (local development)
- ✅ `.env.example` (template for deployment)

## Step 2: Deploy to Render.com

### Option A: Deploy via Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Blueprint"

2. **Connect Your Repository**
   - Select your GitHub repository
   - Render will detect `render.yaml` automatically

3. **Configure Environment Variables**

#### Backend Service (`codex-backend`):
```
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
NODE_ENV=production
PORT=10000
RATE_LIMIT_MAX=100
```

**To get Clerk Secret Key:**
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "API Keys"
4. Copy the "Secret Key" (starts with `sk_test_`)

#### Frontend Service (`codex-frontend`):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_BASE_URL=https://codex-backend.onrender.com
```

**Note:** Replace `codex-backend.onrender.com` with your actual backend URL after deployment.

4. **Deploy**
   - Click "Apply" to start deployment
   - Wait for both services to build and deploy (5-10 minutes)

### Option B: Deploy via CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login to Render
render login

# Deploy from render.yaml
render blueprint deploy
```

## Step 3: Update Clerk Settings

After deployment, update Clerk with your production URLs:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Domains" or "Settings"
4. Add your Render URLs:
   - Frontend: `https://codex-frontend.onrender.com`
   - Backend: `https://codex-backend.onrender.com`

## Step 4: Test Your Deployment

### Test Backend:
```bash
curl https://codex-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-21T...",
  "version": "2.0.0"
}
```

### Test AI Endpoint:
```bash
curl -X POST https://codex-backend.onrender.com/api/ai/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Generator API",
  "geminiConfigured": true
}
```

### Test Frontend:
Visit `https://codex-frontend.onrender.com` in your browser

## Environment Variables Reference

### Backend (`backend-new/.env`)
```env
# Required
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://codex-frontend.onrender.com

# Optional but Recommended
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=auto_generated_by_render
RATE_LIMIT_MAX=100
```

### Frontend (`.env`)
```env
# Required
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=https://codex-backend.onrender.com

# Optional
GEMINI_API_KEY=your_gemini_api_key
```

## Troubleshooting

### Backend Not Starting
1. Check logs in Render dashboard
2. Verify `GEMINI_API_KEY` is set correctly
3. Ensure `PORT=10000` is set
4. Check build command: `cd backend-new && npm install`
5. Check start command: `cd backend-new && npm start`

### Frontend Not Loading
1. Check if backend URL is correct in `VITE_API_BASE_URL`
2. Verify Clerk publishable key is set
3. Check build command: `npm install && npm run build`
4. Ensure `dist` folder is being served

### AI Not Working
1. Verify `GEMINI_API_KEY` is set in backend
2. Check API key has quota available
3. Test with: `curl -X POST https://your-backend.onrender.com/api/ai/health`
4. Check backend logs for errors

### Clerk Authentication Issues
1. Verify both publishable and secret keys are set
2. Check Clerk dashboard for allowed domains
3. Add your Render URLs to Clerk's allowed domains
4. Ensure keys match between frontend and backend

## Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month of runtime
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ Cold starts take 30-60 seconds

**Tip:** Keep your service warm by pinging it every 10 minutes with a cron job or UptimeRobot.

## Updating Your Deployment

### Update Code:
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

Render will automatically redeploy on push.

### Update Environment Variables:
1. Go to Render dashboard
2. Select your service
3. Go to "Environment"
4. Update variables
5. Click "Save Changes"
6. Service will automatically redeploy

## Production Checklist

Before going live:
- [ ] All environment variables set correctly
- [ ] Clerk keys are production keys (not test keys)
- [ ] Gemini API key has sufficient quota
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] AI chat and code generation work
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] Error monitoring set up (optional)

## Support

If you encounter issues:
1. Check Render logs in dashboard
2. Review this guide
3. Check Render documentation: https://render.com/docs
4. Contact Render support: https://render.com/support

---

**Deployment Status:** Ready to deploy ✅
**Last Updated:** January 21, 2026
