# Blog Platform - Vercel Deployment Guide

## 🚀 Deploy Your Blog Platform to Vercel

This guide will help you deploy the complete blog platform (frontend + backend) to production.

---

## 📋 What You Need

1. **GitHub Account** - To store your code
2. **Vercel Account** - For frontend hosting (free)
3. **Render Account** - For backend hosting (free)
4. **Clerk Account** - For authentication (free)

---

## 🎯 Deployment Strategy

```
Frontend (Vercel)          Backend (Render)
    ↓                           ↓
http://localhost:5173  →  http://localhost:3001
         ↓                      ↓
your-app.vercel.app    →  your-backend.onrender.com
```

---

## Step 1: Prepare Your Code

### 1.1 Commit Everything to Git

```bash
git add .
git commit -m "Prepare for Vercel deployment with blog platform"
git push origin main
```

### 1.2 Verify Files Exist

Make sure these files are in your repo:
- ✅ `vercel.json` (already created)
- ✅ `.env.production` (already created)
- ✅ `backend/package.json`
- ✅ `backend/server.js`
- ✅ `backend/routes/blogs.js`

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 2.2 Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repo from the list

### 2.3 Configure Service

```
Name: codex-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 2.4 Add Environment Variables

Click "Advanced" → "Add Environment Variable":

```
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
CLERK_SECRET_KEY=your_clerk_secret_key
```

**To get Clerk Secret Key:**
1. Go to https://dashboard.clerk.com
2. Select your app
3. Go to "API Keys"
4. Copy "Secret Key" (starts with `sk_test_` or `sk_live_`)

### 2.5 Deploy Backend

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. You'll see: "Your service is live 🎉"
4. **Copy your backend URL**: `https://codex-backend-xxxx.onrender.com`

### 2.6 Test Backend

Open in browser:
```
https://your-backend.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

---

## Step 3: Update Backend CORS

### 3.1 Edit backend/server.js

Find the CORS configuration and update it:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://your-project.vercel.app',  // Replace with your Vercel URL
    'https://*.vercel.app'  // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

### 3.2 Commit and Push

```bash
git add backend/server.js
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

Render will automatically redeploy your backend.

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub

### 4.2 Import Project

1. Click "Add New..." → "Project"
2. Find your repository in the list
3. Click "Import"

### 4.3 Configure Project

Vercel will auto-detect Vite. Verify these settings:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

### 4.4 Add Environment Variables

**CRITICAL:** Add these environment variables:

Click "Environment Variables" and add:

#### Variable 1: VITE_CLERK_PUBLISHABLE_KEY
```
Name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2: VITE_API_URL
```
Name: VITE_API_URL
Value: https://your-backend.onrender.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**Important:** Replace `your-backend.onrender.com` with your actual Render URL!

#### Variable 3: VITE_GEMINI_API_KEY (Optional)
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
Environments: ✅ Production ✅ Preview ✅ Development
```

### 4.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see: "Congratulations! 🎉"
4. **Copy your Vercel URL**: `https://your-project.vercel.app`

---

## Step 5: Configure Clerk for Production

### 5.1 Add Vercel Domain to Clerk

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Domains" in sidebar
4. Click "Add domain"
5. Enter: `your-project.vercel.app`
6. Click "Add domain"

### 5.2 Update Redirect URLs

1. Still in Clerk Dashboard
2. Go to "Paths" in sidebar
3. Add these URLs:
   - Sign-in URL: `https://your-project.vercel.app/sign-in`
   - Sign-up URL: `https://your-project.vercel.app/sign-up`
   - After sign-in: `https://your-project.vercel.app/`
   - After sign-up: `https://your-project.vercel.app/`

---

## Step 6: Test Your Deployment

### 6.1 Test Frontend

1. Open: `https://your-project.vercel.app`
2. Should load home page
3. Check browser console (F12) - no errors

### 6.2 Test Authentication

1. Click "Sign In" button
2. Sign in with Clerk
3. Should redirect back to home page
4. Profile dropdown should show your name

### 6.3 Test Blog Platform

1. Go to: `https://your-project.vercel.app/blogs`
2. Click "Create Blog" button
3. Fill in:
   - Title: "My First Production Blog"
   - Content: "Hello from Vercel!"
   - Tags: vercel, deployment
4. Click "Publish Blog"
5. Should see success message
6. Blog should appear in the list

### 6.4 Test All Features

- ✅ Like a blog
- ✅ Add a comment
- ✅ Follow a user
- ✅ Search by tags
- ✅ View trending blogs

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch" Error

**Symptoms:** Blog creation fails with fetch error

**Cause:** Backend URL not set correctly

**Fix:**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Check `VITE_API_URL` value
4. Should be: `https://your-backend.onrender.com`
5. Make sure it's set for all environments
6. Redeploy: Deployments → Latest → "Redeploy"

### Issue 2: CORS Error

**Symptoms:** Console shows CORS policy error

**Cause:** Backend not allowing Vercel domain

**Fix:**
1. Edit `backend/server.js`
2. Add your Vercel URL to CORS origins:
```javascript
origin: [
  'https://your-project.vercel.app',
  'https://*.vercel.app'
]
```
3. Commit and push
4. Render will auto-redeploy

### Issue 3: Clerk Sign In Not Working

**Symptoms:** Redirect loop or sign in fails

**Cause:** Vercel domain not added to Clerk

**Fix:**
1. Go to Clerk Dashboard
2. Add Vercel domain to allowed domains
3. Update redirect URLs
4. Clear browser cache
5. Try again

### Issue 4: Backend Cold Start

**Symptoms:** First request takes 30-60 seconds

**Cause:** Render free tier spins down after 15 min inactivity

**Fix:** This is normal for free tier. Options:
- Wait for cold start (30-60 seconds)
- Upgrade to paid plan ($7/month for always-on)
- Use a ping service to keep it warm

### Issue 5: Environment Variables Not Working

**Symptoms:** Features not working, console errors

**Cause:** Variables not set for all environments

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. For each variable, make sure checked:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
3. Click "Save"
4. Redeploy

---

## 📊 Monitoring

### View Vercel Logs

1. Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click on latest deployment
4. View build logs and runtime logs

### View Backend Logs

1. Render Dashboard → Your Service
2. Click "Logs" tab
3. View real-time logs
4. Filter by error/warning

### Enable Analytics

1. Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. Enable Web Analytics (free)
4. View traffic, performance, errors

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to main** → Production deployment
- **Push to other branch** → Preview deployment
- **Pull request** → Preview deployment with unique URL

Example:
```bash
git add .
git commit -m "Add new blog feature"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Send you a notification

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Blog Platform)

**Vercel:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments
- **Cost:** $0/month

**Render:**
- ✅ 750 hours/month (1 service always-on)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min (free tier)
- **Cost:** $0/month

**Clerk:**
- ✅ 10,000 monthly active users
- ✅ Unlimited sign-ins
- ✅ Social logins
- **Cost:** $0/month

**Total:** $0/month! 🎉

---

## 🚀 Your URLs

After deployment, you'll have:

### Production URLs
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Blogs:** `https://your-project.vercel.app/blogs`

### API Endpoints
- **Health:** `https://your-backend.onrender.com/health`
- **Blogs:** `https://your-backend.onrender.com/api/blogs/all`
- **Create:** `https://your-backend.onrender.com/api/blogs/create`

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Code committed to GitHub
- [ ] Backend routes working locally
- [ ] Frontend working locally
- [ ] Environment variables ready

### Backend (Render)
- [ ] Service created
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Health check working
- [ ] CORS configured

### Frontend (Vercel)
- [ ] Project imported
- [ ] Environment variables added
- [ ] All environments selected
- [ ] Deployed successfully
- [ ] Site loads without errors

### Clerk
- [ ] Vercel domain added
- [ ] Redirect URLs updated
- [ ] Sign in working

### Testing
- [ ] Home page loads
- [ ] Can navigate to /blogs
- [ ] Can sign in
- [ ] Can create blog
- [ ] Can like/comment
- [ ] All features working

---

## 🎉 Success!

Your blog platform is now live on Vercel!

**Share your site:**
- Copy your Vercel URL
- Share with friends
- Post on social media
- Add to your portfolio

**Next steps:**
- Add custom domain (optional)
- Enable analytics
- Monitor performance
- Add more features
- Get feedback from users

---

## 📞 Need Help?

If you encounter issues:

1. **Check logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Render: Dashboard → Logs

2. **Check environment variables:**
   - Vercel: Settings → Environment Variables
   - Render: Environment → Environment Variables

3. **Test backend:**
   - Open: `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`

4. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

---

## 📚 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Clerk Docs:** https://clerk.com/docs
- **Vite Docs:** https://vitejs.dev

---

## Summary

1. ✅ Deploy backend to Render
2. ✅ Copy backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Add environment variables
5. ✅ Configure Clerk
6. ✅ Test everything
7. ✅ Share your site! 🚀

**Your blog platform is live!** 🎉
