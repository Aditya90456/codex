# Vercel Deployment Guide - Complete Setup

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free at https://vercel.com)
- Backend deployed (Render.com recommended)

---

## Step 1: Deploy Backend First (Required)

### Option A: Deploy to Render.com (Free)

1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up/Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure Service**
   ```
   Name: codex-backend
   Region: Choose closest to you
   Branch: main (or your branch)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   PORT=3001
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy your backend URL: `https://codex-backend-xxxx.onrender.com`

### Option B: Deploy to Railway.app (Alternative)

1. Visit https://railway.app
2. Connect GitHub repo
3. Select backend folder
4. Add environment variables
5. Deploy

---

## Step 2: Deploy Frontend to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_API_URL=https://your-backend.onrender.com
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

   **Important:** Add these for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://your-project.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_CLERK_PUBLISHABLE_KEY
   vercel env add VITE_API_URL
   vercel env add VITE_GEMINI_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Step 3: Configure Environment Variables

### Required Variables

#### 1. VITE_CLERK_PUBLISHABLE_KEY
- Get from: https://dashboard.clerk.com
- Go to: API Keys
- Copy: Publishable key (starts with `pk_test_` or `pk_live_`)
- Example: `pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk`

#### 2. VITE_API_URL
- Your backend URL from Render/Railway
- Example: `https://codex-backend-xxxx.onrender.com`
- **Important:** No trailing slash!

#### 3. VITE_GEMINI_API_KEY (Optional)
- Get from: https://makersuite.google.com/app/apikey
- Only needed if using AI features
- Example: `AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc`

### How to Add in Vercel Dashboard

1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. For each variable:
   - Name: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: `your_actual_key`
   - Environments: Check all (Production, Preview, Development)
   - Click "Save"

---

## Step 4: Update Backend CORS

Your backend needs to allow requests from Vercel domain.

**Edit `backend/server.js`:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://your-project.vercel.app',  // Add your Vercel URL
    'https://*.vercel.app'  // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

**Redeploy backend** after this change.

---

## Step 5: Update Clerk Settings

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Select your application

2. **Add Vercel Domain**
   - Go to: "Domains" section
   - Add your Vercel URL: `https://your-project.vercel.app`
   - Save changes

3. **Update Redirect URLs**
   - Go to: "Paths" section
   - Add Vercel URLs to allowed redirects

---

## Step 6: Test Deployment

### 1. Check Frontend
- Visit: `https://your-project.vercel.app`
- Should load without errors
- Check browser console (F12) for errors

### 2. Check Backend Connection
- Open browser console
- Go to Network tab
- Try creating a blog
- Should see requests to your backend URL

### 3. Test Blog Features
- Sign in with Clerk
- Go to `/blogs` page
- Create a blog
- Like, comment, follow
- All features should work

---

## Common Issues & Fixes

### Issue 1: "Failed to fetch" Error

**Cause:** Backend URL not set or wrong

**Fix:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend is deployed and running
3. Test backend: `https://your-backend.onrender.com/health`

### Issue 2: CORS Error

**Cause:** Backend not allowing Vercel domain

**Fix:**
```javascript
// In backend/server.js
app.use(cors({
  origin: ['https://your-project.vercel.app', 'https://*.vercel.app'],
  credentials: true
}));
```

### Issue 3: Clerk Authentication Not Working

**Cause:** Vercel domain not added to Clerk

**Fix:**
1. Go to Clerk Dashboard
2. Add Vercel URL to allowed domains
3. Update redirect URLs

### Issue 4: Environment Variables Not Working

**Cause:** Variables not set for all environments

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Make sure each variable is checked for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
3. Redeploy

### Issue 5: Build Fails

**Cause:** Missing dependencies or build errors

**Fix:**
1. Check build logs in Vercel
2. Run `npm run build` locally to test
3. Fix any TypeScript/ESLint errors
4. Commit and push changes

---

## Deployment Checklist

### Backend (Render/Railway)
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Environment variables set
- [ ] CORS configured with Vercel domain
- [ ] Health check working: `/health`

### Frontend (Vercel)
- [ ] Project imported to Vercel
- [ ] Build settings configured
- [ ] Environment variables added:
  - [ ] VITE_CLERK_PUBLISHABLE_KEY
  - [ ] VITE_API_URL
  - [ ] VITE_GEMINI_API_KEY (optional)
- [ ] All environments selected for each variable
- [ ] Deployed successfully
- [ ] Site loads without errors

### Clerk Configuration
- [ ] Vercel domain added to Clerk
- [ ] Redirect URLs updated
- [ ] Sign in/Sign up working

### Testing
- [ ] Home page loads
- [ ] Can navigate to /blogs
- [ ] Can sign in
- [ ] Can create blog
- [ ] Can like/comment
- [ ] All features working

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

---

## Custom Domain (Optional)

### Add Custom Domain

1. **Go to Vercel Dashboard**
   - Select your project
   - Click "Settings" → "Domains"

2. **Add Domain**
   - Enter your domain: `yourdomain.com`
   - Follow DNS configuration instructions

3. **Update Clerk**
   - Add custom domain to Clerk dashboard
   - Update redirect URLs

4. **Update Backend CORS**
   - Add custom domain to allowed origins

---

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click on a deployment
5. View build logs and runtime logs

### View Backend Logs
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. View real-time logs

---

## Cost Breakdown

### Free Tier Limits

**Vercel (Frontend):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments

**Render (Backend):**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min inactivity (free tier)
- ⚠️ Cold start: 30-60 seconds

**Clerk (Auth):**
- ✅ 10,000 monthly active users
- ✅ Unlimited sign-ins
- ✅ Social logins

**Total Cost:** $0/month for hobby projects! 🎉

---

## Production Optimization

### 1. Enable Caching
Already configured in `vercel.json`

### 2. Optimize Images
Use Vercel Image Optimization:
```jsx
import Image from 'next/image'
// Or use Vite's image optimization
```

### 3. Enable Analytics
1. Go to Vercel Dashboard
2. Click "Analytics" tab
3. Enable Web Analytics (free)

### 4. Add Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## Rollback Deployment

If something goes wrong:

1. **Go to Vercel Dashboard**
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "..." → "Promote to Production"

---

## Environment-Specific Configs

### Development
```env
VITE_API_URL=http://localhost:3001
```

### Production
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Preview (Vercel)
```env
VITE_API_URL=https://your-backend-preview.onrender.com
```

---

## Next Steps After Deployment

1. **Test Everything**
   - All pages load
   - Authentication works
   - Blog features work
   - No console errors

2. **Share Your Site**
   - Copy Vercel URL
   - Share with users
   - Get feedback

3. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor backend logs
   - Watch for errors

4. **Iterate**
   - Fix bugs
   - Add features
   - Push to GitHub
   - Auto-deploy! 🚀

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Clerk Docs:** https://clerk.com/docs
- **Vite Docs:** https://vitejs.dev

---

## Quick Commands

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables
vercel env pull

# Link to existing project
vercel link
```

---

## Summary

1. ✅ Deploy backend to Render.com
2. ✅ Copy backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Add environment variables
5. ✅ Update CORS in backend
6. ✅ Add Vercel domain to Clerk
7. ✅ Test everything
8. ✅ Share your site! 🎉

Your blog platform is now live on Vercel! 🚀
