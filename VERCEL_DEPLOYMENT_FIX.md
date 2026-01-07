# Vercel Deployment Fix - Sign Up Not Working

## 🚨 Issue Identified

Your sign-up is not working on Vercel because:

1. **Invalid Clerk Key**: Your current key `pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk` ends with `$` which is invalid
2. **Missing Environment Variables**: Vercel needs the correct environment variables
3. **Domain Configuration**: Clerk needs to know about your Vercel domain

## 🔧 Step-by-Step Fix

### Step 1: Get Your Real Clerk Key

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Create/Select Application**: 
   - If you don't have an app, click "Create Application"
   - Name it "Codex Playground" 
   - Choose your preferred sign-in options
3. **Get API Keys**:
   - Go to "API Keys" in the sidebar
   - Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Your Project**: Click on your codex-playground project
3. **Go to Settings**: Click "Settings" tab
4. **Environment Variables**: Click "Environment Variables" in sidebar
5. **Add These Variables**:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_test_YOUR_REAL_KEY_HERE
CLERK_SECRET_KEY = sk_test_YOUR_REAL_SECRET_KEY_HERE
VITE_API_BASE_URL = https://your-backend-url.vercel.app
```

**Important**: Replace with your actual keys from Step 1!

### Step 3: Configure Clerk Domain Settings

1. **In Clerk Dashboard**: Go to "Domains" section
2. **Add Production Domain**: Add your Vercel URL:
   - `https://codex-playground-editor.vercel.app`
   - Or your custom domain if you have one
3. **Add Development Domain** (if testing):
   - `http://localhost:5173`

### Step 4: Update Local Environment

Update your `.env` file with the real key:

```env
# Replace with your REAL Clerk key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_REAL_KEY_HERE
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

### Step 5: Redeploy

1. **Commit Changes**: 
   ```bash
   git add .
   git commit -m "Fix Clerk authentication for Vercel"
   git push
   ```

2. **Vercel Auto-Deploy**: Vercel will automatically redeploy with new environment variables

## 🔍 Testing After Fix

1. **Visit Your Vercel URL**: https://codex-playground-editor.vercel.app
2. **Click "Get Started"**: Should open sign-up modal
3. **Try Sign Up**: Should work without errors
4. **Check Browser Console**: Should see no Clerk errors

## 🚨 Common Issues & Solutions

### Issue: "Invalid publishable key"
**Solution**: Make sure your key starts with `pk_test_` or `pk_live_` and doesn't end with `$`

### Issue: "Domain not allowed"
**Solution**: Add your Vercel domain to Clerk's allowed domains

### Issue: "Environment variable not found"
**Solution**: Make sure you added `VITE_CLERK_PUBLISHABLE_KEY` to Vercel (with VITE_ prefix)

### Issue: Sign-up form shows but doesn't submit
**Solution**: Check that `CLERK_SECRET_KEY` is set in Vercel environment variables

## 📋 Verification Checklist

- [ ] Got real Clerk publishable key from dashboard
- [ ] Added `VITE_CLERK_PUBLISHABLE_KEY` to Vercel environment variables
- [ ] Added `CLERK_SECRET_KEY` to Vercel environment variables  
- [ ] Added Vercel domain to Clerk allowed domains
- [ ] Redeployed application
- [ ] Tested sign-up flow on production URL
- [ ] No console errors related to Clerk

## 🎯 Expected Result

After following these steps:
- ✅ Sign-up modal opens properly
- ✅ Users can enter email/password
- ✅ Sign-up completes successfully
- ✅ Users are redirected to main app
- ✅ No authentication errors in console

## 🔗 Helpful Links

- [Clerk Dashboard](https://dashboard.clerk.com)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk Vercel Deployment Guide](https://clerk.com/docs/deployments/vercel)