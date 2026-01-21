# 🚀 Backend Deployment Fix Guide

## ✅ What's Been Done

1. **AI Generator Routes Migrated** from `backend-new` to `backend`
2. **Backend Server Updated** to include AI routes at `/api/ai`
3. **Environment Variables** configured in `backend/.env`
4. **Gemini API Key** added to backend configuration

## 📁 Current Backend Structure

```
backend/
├── routes/
│   └── ai-generator.js    ✅ Gemini AI routes
├── server.js              ✅ Updated with AI integration
├── package.json           ✅ Dependencies
├── .env                   ✅ Local environment (with Gemini key)
└── .env.example           ✅ Template for deployment
```

## 🔧 Backend Endpoints Available

### Core Endpoints
- `GET /health` - Health check with Gemini status
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/execute` - Execute code with test cases
- `POST /api/submit` - Submit solution
- `GET /api/submissions` - Get all submissions
- `POST /api/execute/custom` - Custom code execution

### AI Endpoints (NEW)
- `GET /api/ai/health` - AI service health check
- `POST /api/ai/generate` - Generate code with Gemini AI
- `POST /api/ai/chat` - Chat with Gemini AI assistant

## 🐛 Troubleshooting Deployed Backend

### Issue: Backend Not Working on Render

**Possible Causes:**

1. **Missing Environment Variables**
   - Gemini API key not set in Render dashboard
   - Other required env vars missing

2. **Build/Start Command Issues**
   - Build command might be failing
   - Dependencies not installing correctly

3. **Routes Not Loading**
   - File path issues on Linux (Render uses Linux)
   - Module not found errors

### ✅ Solution Steps

#### Step 1: Check Render Logs
1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for errors during:
   - Build phase
   - Deploy phase
   - Runtime

#### Step 2: Verify Environment Variables
In Render Dashboard → Your Service → Environment:

**Required Variables:**
```
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.onrender.com
RATE_LIMIT_MAX=100
```

**Optional Variables:**
```
CLERK_SECRET_KEY=your-clerk-secret-key
JWT_SECRET=auto-generated-by-render
```

#### Step 3: Test Deployed Backend

Once deployed, test these URLs (replace with your actual backend URL):

```bash
# Health check
https://your-backend.onrender.com/health

# AI health check
https://your-backend.onrender.com/api/ai/health

# Problems endpoint
https://your-backend.onrender.com/api/problems
```

#### Step 4: Common Error Fixes

**Error: "Cannot find module './routes/ai-generator'"**
- Solution: Ensure `backend/routes/ai-generator.js` exists in your repo
- Run: `git add backend/routes/ai-generator.js`
- Run: `git commit -m "Add AI generator routes"`
- Run: `git push`

**Error: "GEMINI_API_KEY is not defined"**
- Solution: Add the environment variable in Render dashboard
- The backend will use fallback templates if key is missing (not an error)

**Error: "Port already in use"**
- Solution: Render automatically assigns PORT=10000
- Make sure your server.js uses `process.env.PORT`

**Error: "CORS policy blocked"**
- Solution: Update FRONTEND_URL environment variable
- Should match your deployed frontend URL

## 🧪 Local Testing

Test the backend locally before deploying:

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

Then run the test script:
```bash
# From project root
node test-backend-ai.js
```

Expected output:
```
🚀 Starting backend AI tests...

🔍 Testing health check...
✅ Health check: { status: 'OK', geminiConfigured: true, ... }

🔍 Testing AI health check...
✅ AI health check: { status: 'healthy', geminiConfigured: true, ... }

🔍 Testing AI chat endpoint...
✅ AI chat response: { success: true, source: 'gemini-ai', ... }

🔍 Testing AI code generation...
✅ AI generation response: { success: true, source: 'gemini-ai', ... }

✅ All tests completed!
```

## 📝 Deployment Checklist

Before deploying to Render:

- [ ] `backend/routes/ai-generator.js` exists
- [ ] `backend/server.js` imports and mounts AI routes
- [ ] `backend/.env` has GEMINI_API_KEY (for local testing)
- [ ] `backend/.env.example` updated with all variables
- [ ] All changes committed to git
- [ ] Changes pushed to GitHub/GitLab
- [ ] Environment variables set in Render dashboard
- [ ] Build command: `cd backend && npm install`
- [ ] Start command: `cd backend && npm start`

## 🔄 Redeploy Steps

If you need to redeploy:

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Fix backend deployment"
   git push
   ```

2. **Trigger Redeploy in Render**
   - Go to Render dashboard
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or wait for auto-deploy if enabled

3. **Monitor Logs**
   - Watch the build logs for errors
   - Check runtime logs after deployment

4. **Test Endpoints**
   - Test `/health` endpoint first
   - Then test `/api/ai/health`
   - Finally test AI generation

## 🆘 Still Not Working?

If backend is still not working after following all steps:

1. **Check Render Service Status**
   - Is the service running?
   - Any recent outages?

2. **Review Build Logs**
   - Copy the full error message
   - Look for "npm install" failures
   - Check for missing dependencies

3. **Verify render.yaml**
   - Ensure it points to `backend` folder
   - Check build and start commands

4. **Test Locally First**
   - If it doesn't work locally, it won't work deployed
   - Fix local issues before deploying

## 📞 Quick Debug Commands

```bash
# Check if routes file exists
ls -la backend/routes/

# Test backend locally
cd backend && npm start

# Check git status
git status

# View recent commits
git log --oneline -5

# Force push (if needed)
git push --force origin main
```

## ✨ Success Indicators

Your backend is working correctly when:
- ✅ `/health` returns `{ status: 'OK', geminiConfigured: true }`
- ✅ `/api/ai/health` returns `{ status: 'healthy' }`
- ✅ `/api/ai/chat` responds with AI-generated text
- ✅ `/api/ai/generate` creates code/HTML
- ✅ No errors in Render logs
- ✅ Frontend can connect to backend

---

**Last Updated:** January 2026
**Backend Version:** 1.0.0 with Gemini AI Integration
