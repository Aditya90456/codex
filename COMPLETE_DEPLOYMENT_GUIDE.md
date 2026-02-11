# Complete Deployment Guide 🚀

## Overview

Your application has two parts:
1. **Frontend** (Vite/React) → Deploy to Vercel
2. **Backend** (Node.js/Express) → Deploy to Render.com

## ✅ What's Already Fixed

- ✅ Removed secret references from `vercel.json`
- ✅ Backend `.env` configured correctly
- ✅ Frontend `.env` configured correctly
- ✅ DSA Roadmap Tracker implemented and working

## Frontend Deployment (Vercel)

### Step 1: Push the Fixed Code

```bash
git add vercel.json
git commit -m "fix: remove secret references from vercel.json"
git push
```

### Step 2: Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 3 variables:

```
Name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: VITE_API_URL
Value: https://codex-res1.onrender.com
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
Environments: ✓ Production ✓ Preview ✓ Development
```

### Step 3: Deploy

Vercel will automatically deploy when you push. Check the deployment logs.

## Backend Deployment (Render.com)

Your backend is already deployed at: `https://codex-res1.onrender.com`

### Verify Backend Environment Variables

Make sure these are set in Render.com dashboard:

```
GEMINI_API_KEY = AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
PORT = 3001
NODE_ENV = production
FRONTEND_URL = https://your-vercel-app.vercel.app
CLERK_SECRET_KEY = sk_test_IMYRW0puwKsc4JPytej9AW6DtGSMiwCsSJcL3atVy
GITHUB_TOKEN = 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
SMTP_USER = adityabakshi1011@gmail.com
SMTP_PASS = ADITYA@119
APP_URL = https://your-vercel-app.vercel.app
```

### Update FRONTEND_URL After Vercel Deployment

After your Vercel deployment succeeds:
1. Copy your Vercel URL (e.g., `https://codex-playground-editor.vercel.app`)
2. Update `FRONTEND_URL` in Render.com to match
3. Update `APP_URL` in Render.com to match
4. Redeploy backend on Render.com

## Environment Variables Summary

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://127.0.0.1:3001
VITE_BACKEND_URL=http://127.0.0.1:3001
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
```

### Frontend (.env.production)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=https://codex-res1.onrender.com
VITE_GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
```

### Backend (.env)
```env
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
PORT=3001
FRONTEND_URL=http://127.0.0.1:5173
NODE_ENV=development
CLERK_SECRET_KEY=sk_test_IMYRW0puwKsc4JPytej9AW6DtGSMiwCsSJcL3atVy
GITHUB_TOKEN=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
SMTP_USER=adityabakshi1011@gmail.com
SMTP_PASS=ADITYA@119
APP_URL=http://localhost:5173
```

## Deployment Checklist

### Frontend (Vercel)
- [ ] Push fixed `vercel.json` (no secret references)
- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` in Vercel dashboard
- [ ] Add `VITE_API_URL` in Vercel dashboard
- [ ] Add `VITE_GEMINI_API_KEY` in Vercel dashboard
- [ ] Wait for deployment to complete
- [ ] Test the live site

### Backend (Render.com)
- [ ] Verify all environment variables are set
- [ ] Update `FRONTEND_URL` with Vercel URL
- [ ] Update `APP_URL` with Vercel URL
- [ ] Redeploy if needed
- [ ] Test API endpoint: `https://codex-res1.onrender.com/health`

## Testing After Deployment

### 1. Test Backend
```bash
curl https://codex-res1.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "version": "1.0.0",
  "geminiConfigured": true
}
```

### 2. Test Frontend
- Visit your Vercel URL
- Check if Clerk authentication works
- Try the LeetCode Editor
- Test the DSA Roadmap Tracker (click "Roadmap" button)
- Test blog creation
- Test AI features

### 3. Test Integration
- Submit a problem in LeetCode Editor
- Check if it records in Roadmap Tracker
- Verify backend API calls work
- Test GitHub integration

## Common Issues

### Issue 1: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in backend matches your Vercel URL

### Issue 2: Clerk Authentication Fails
**Solution**: Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct in Vercel

### Issue 3: API Calls Fail
**Solution**: Check `VITE_API_URL` points to `https://codex-res1.onrender.com`

### Issue 4: Roadmap Not Saving
**Solution**: Ensure backend has write permissions for `backend/data/roadmap/` directory

## File Structure

```
codex/
├── frontend/
│   ├── .env (local development)
│   ├── .env.production (production values)
│   ├── .env.example (template)
│   └── vercel.json (deployment config)
├── backend/
│   ├── .env (local development)
│   ├── .env.example (template)
│   ├── server.js
│   ├── routes/
│   │   ├── roadmap.js (DSA Roadmap API)
│   │   ├── blogs.js
│   │   └── ... (other routes)
│   └── data/
│       ├── roadmap/ (user roadmap data)
│       └── blogs/ (blog data)
└── docs/
    ├── VERCEL_FIXED_FINAL.md
    ├── DSA_ROADMAP_TRACKER_COMPLETE.md
    └── COMPLETE_DEPLOYMENT_GUIDE.md (this file)
```

## URLs

- **Frontend (Vercel)**: https://codex-playground-editor.vercel.app (or your URL)
- **Backend (Render)**: https://codex-res1.onrender.com
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Render
2. Verify all environment variables are set correctly
3. Test backend health endpoint
4. Check browser console for errors
5. Review the specific error guides:
   - `VERCEL_FIXED_FINAL.md` - Vercel deployment
   - `DSA_ROADMAP_TRACKER_COMPLETE.md` - Roadmap feature
   - `BLOG_VERCEL_DEPLOYMENT.md` - Blog deployment

## Next Steps After Deployment

1. **Update Clerk Settings**:
   - Add your Vercel URL to allowed origins
   - Update redirect URLs

2. **Test All Features**:
   - Authentication
   - LeetCode Editor
   - DSA Roadmap Tracker
   - Blog Platform
   - AI Features
   - GitHub Integration

3. **Monitor**:
   - Check Vercel analytics
   - Monitor Render logs
   - Watch for errors

4. **Optimize**:
   - Enable caching
   - Optimize images
   - Minimize bundle size

---

**You're ready to deploy!** 🚀

Just push the fixed `vercel.json` and add the environment variables in Vercel dashboard.
