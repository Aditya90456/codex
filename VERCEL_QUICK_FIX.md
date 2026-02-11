# Vercel Deployment - Quick Fix ⚡

## The Error
```
"VITE_CLERK_PUBLISHABLE_KEY" references Secret "clerk_publishable_key", which does not exist.
```

## The Fix (2 Minutes)

### 1. Open Vercel Dashboard
https://vercel.com/dashboard → Your Project → **Settings** → **Environment Variables**

### 2. Add These 3 Variables

Click **Add New** for each:

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

### 3. Redeploy
Go to **Deployments** tab → Click **...** on latest → **Redeploy**

## Done! ✅

Your deployment should now succeed.

---

**Full Guide**: See `VERCEL_CLERK_FIX.md` for detailed instructions.
