# 🚀 Vercel Deployment - Offline Mode Guide

## ✅ Deploy Your Website to Vercel in Offline Mode

Your Codex platform can now be deployed to Vercel in **offline mode** without requiring Clerk authentication!

## 📋 Prerequisites

- Vercel account
- GitHub repository with your code
- This codebase

## 🎯 Deployment Steps

### Option 1: Deploy in Offline Mode (No Clerk Required)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add offline mode support"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In Vercel dashboard, add this environment variable:
   
   ```
   VITE_DEPLOYMENT_MODE = offline
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live in offline mode!

### Option 2: Deploy in Online Mode (With Clerk)

1. **Push to GitHub** (same as above)

2. **Import to Vercel** (same as above)

3. **Configure Environment Variables**
   In Vercel dashboard, add these:
   
   ```
   VITE_DEPLOYMENT_MODE = online
   VITE_CLERK_PUBLISHABLE_KEY = your_clerk_publishable_key
   ```

4. **Deploy!**

## 🔧 Environment Variables Explained

### For Offline Mode:
```
VITE_DEPLOYMENT_MODE=offline
```
- Forces offline mode on Vercel
- No Clerk required
- Uses local authentication
- Perfect for demos/testing

### For Online Mode:
```
VITE_DEPLOYMENT_MODE=online
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
- Uses Clerk authentication
- Production-ready
- Cloud features enabled

### Auto Mode (Not Recommended for Vercel):
Don't set `VITE_DEPLOYMENT_MODE`
- Will auto-detect based on Clerk key
- May not work as expected on Vercel

## 📱 How It Works

### Priority Order:
1. **VITE_DEPLOYMENT_MODE** (highest) - Vercel env var
2. **User Preference** - localStorage setting
3. **Auto-detection** - Based on connectivity

### On Vercel:
- Setting `VITE_DEPLOYMENT_MODE=offline` forces offline mode
- Users can still switch modes using the mode switcher button
- Data stored in browser localStorage

## 🎨 Features in Offline Mode on Vercel

✅ All editors work
✅ DSA problems and tutorials
✅ AI Creator (local mode)
✅ Full navigation
✅ User authentication (local)
✅ Data persistence (browser)
✅ No external dependencies

## 🔄 Switching Modes After Deployment

Users can switch modes using the **Mode Switcher** button (bottom-right):
- 🟣 Auto Mode
- 🟠 Offline Mode
- 🟢 Online Mode

## 📝 Vercel Configuration Files

### vercel.json (Already configured)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### .env.example (For reference)
```
VITE_DEPLOYMENT_MODE=offline
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
```

## 🚨 Important Notes

### Offline Mode on Vercel:
- ⚠️ Data stored in browser only
- ⚠️ Not synced across devices
- ⚠️ Passwords in plain text (localStorage)
- ✅ Perfect for demos and testing
- ✅ No backend required

### Online Mode on Vercel:
- ✅ Secure authentication
- ✅ Cloud data sync
- ✅ Multi-device support
- ✅ Production-ready
- ⚠️ Requires Clerk account

## 🎯 Recommended Setup

### For Demo/Testing:
```
VITE_DEPLOYMENT_MODE=offline
```

### For Production:
```
VITE_DEPLOYMENT_MODE=online
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

## 🐛 Troubleshooting

### Issue: Site shows "Missing Clerk Key"
**Solution:** Set `VITE_DEPLOYMENT_MODE=offline` in Vercel

### Issue: Offline mode not working
**Solution:** 
1. Check environment variable is set correctly
2. Redeploy after adding env var
3. Clear browser cache

### Issue: Can't switch modes
**Solution:** Mode switcher button is in bottom-right corner

### Issue: Data not persisting
**Solution:** Check browser localStorage is enabled

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository imported to Vercel
- [ ] Environment variable set (`VITE_DEPLOYMENT_MODE`)
- [ ] Build successful
- [ ] Site accessible
- [ ] Can create account
- [ ] Navigation works
- [ ] Mode switcher visible

## 🎉 Success!

Your Codex platform is now deployed to Vercel in offline mode!

**Live URL:** `https://your-project.vercel.app`

**Test it:**
1. Visit your Vercel URL
2. Sign up with any credentials
3. Access all features
4. Switch modes if needed

---

**Need help?** Check the console logs for mode detection info!
