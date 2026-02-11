# Fix Vercel Clerk Deployment Error 🔧

## Error
```
"VITE_CLERK_PUBLISHABLE_KEY" references Secret "clerk_publishable_key", which does not exist.
```

## Problem
Vercel is trying to reference a secret that doesn't exist. You need to set the environment variable directly in Vercel.

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project (codex-playground-editor)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Required Environment Variables

Add these 3 environment variables:

#### 1. VITE_CLERK_PUBLISHABLE_KEY
- **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
- **Value**: `pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk`
- **Environment**: Production, Preview, Development (select all)

#### 2. VITE_API_URL
- **Key**: `VITE_API_URL`
- **Value**: `https://codex-res1.onrender.com`
- **Environment**: Production, Preview, Development (select all)

#### 3. VITE_GEMINI_API_KEY (Optional - for AI features)
- **Key**: `VITE_GEMINI_API_KEY`
- **Value**: `AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc`
- **Environment**: Production, Preview, Development (select all)

### Step 3: Remove Secret References (if any)

If you have any secret references in your Vercel configuration:
1. Go to **Settings** → **Environment Variables**
2. Look for any variables with `@clerk_publishable_key` or similar
3. Delete them
4. Add the plain environment variables as shown above

### Step 4: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Alternative: Use Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_CLERK_PUBLISHABLE_KEY production
# Paste: pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk

vercel env add VITE_API_URL production
# Paste: https://codex-res1.onrender.com

vercel env add VITE_GEMINI_API_KEY production
# Paste: AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc

# Redeploy
vercel --prod
```

## Verify Environment Variables

After adding, you should see in Vercel dashboard:

```
Environment Variables (3)
├─ VITE_CLERK_PUBLISHABLE_KEY = pk_test_ZW5k... (Production, Preview, Development)
├─ VITE_API_URL = https://codex-res1.onrender.com (Production, Preview, Development)
└─ VITE_GEMINI_API_KEY = AIzaSyDP... (Production, Preview, Development)
```

## Important Notes

### 1. Get Your Real Clerk Key
The current Clerk key might be a placeholder. To get your real key:
1. Go to https://dashboard.clerk.com
2. Sign in to your account
3. Select your application
4. Go to **API Keys**
5. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)
6. Update the environment variable in Vercel

### 2. Backend URL
Make sure your backend is deployed and accessible:
- Current: `https://codex-res1.onrender.com`
- Test it: `curl https://codex-res1.onrender.com/health`
- Should return: `{"status":"OK",...}`

### 3. Don't Use Secrets for Public Keys
- Clerk publishable keys are meant to be public
- Use plain environment variables, not Vercel Secrets
- Secrets are for sensitive data like API keys and tokens

## Troubleshooting

### Still getting the error?
1. Clear Vercel cache:
   - Go to **Settings** → **General**
   - Scroll to **Build & Development Settings**
   - Clear build cache
   - Redeploy

2. Check for typos:
   - Variable name must be exactly: `VITE_CLERK_PUBLISHABLE_KEY`
   - No spaces, no extra characters

3. Check environment selection:
   - Make sure you selected **Production** when adding the variable
   - If deploying to preview, also select **Preview**

### Deployment still failing?
Check the deployment logs:
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Check the **Build Logs**
4. Look for specific error messages

## Quick Fix Checklist

- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk key
- [ ] Add `VITE_API_URL` with your backend URL
- [ ] Add `VITE_GEMINI_API_KEY` (optional)
- [ ] Select all environments (Production, Preview, Development)
- [ ] Save changes
- [ ] Redeploy from Deployments tab
- [ ] Check deployment logs for success

## Expected Result

After fixing, your deployment should succeed and you'll see:
```
✓ Build completed successfully
✓ Deployment ready
✓ Your site is live at https://your-app.vercel.app
```

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs for specific errors
2. Verify your Clerk key is valid at https://dashboard.clerk.com
3. Test your backend URL: `curl https://codex-res1.onrender.com/health`
4. Make sure all environment variables are set correctly

---

**Quick Summary:**
Go to Vercel → Settings → Environment Variables → Add the 3 variables → Redeploy ✅
