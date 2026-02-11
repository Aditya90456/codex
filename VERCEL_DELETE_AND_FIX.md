# Fix Vercel Secret Reference Error - DELETE FIRST! 🔥

## The Problem
You have an existing environment variable that references a secret:
```
VITE_CLERK_PUBLISHABLE_KEY = @clerk_publishable_key (secret reference)
```

This secret doesn't exist, causing the deployment to fail.

## The Solution: DELETE then ADD

### Step 1: DELETE the Existing Variable ❌

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Find `VITE_CLERK_PUBLISHABLE_KEY`
6. Click the **trash icon** 🗑️ or **...** menu → **Delete**
7. Confirm deletion

**IMPORTANT**: You MUST delete the old variable that references the secret!

### Step 2: ADD New Variables (Plain Values) ✅

Now add these as **plain text values** (NOT secret references):

#### Variable 1: VITE_CLERK_PUBLISHABLE_KEY
```
Name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk
Environments: ✓ Production ✓ Preview ✓ Development
```

**Make sure you paste the actual value, NOT a reference like @clerk_publishable_key**

#### Variable 2: VITE_API_URL
```
Name: VITE_API_URL
Value: https://codex-res1.onrender.com
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Variable 3: VITE_GEMINI_API_KEY (Optional)
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
Environments: ✓ Production ✓ Preview ✓ Development
```

### Step 3: Verify No Secret References

After adding, your environment variables should look like this:

```
VITE_CLERK_PUBLISHABLE_KEY
Production: pk_test_ZW5k... (Plaintext)
Preview: pk_test_ZW5k... (Plaintext)
Development: pk_test_ZW5k... (Plaintext)

VITE_API_URL
Production: https://codex-res1.onrender.com (Plaintext)
Preview: https://codex-res1.onrender.com (Plaintext)
Development: https://codex-res1.onrender.com (Plaintext)
```

**NOT like this** (with @ symbol):
```
❌ VITE_CLERK_PUBLISHABLE_KEY = @clerk_publishable_key
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Visual Guide

### What You're Looking For:

**WRONG** (causes error):
```
┌─────────────────────────────────────────┐
│ VITE_CLERK_PUBLISHABLE_KEY              │
│ Production: @clerk_publishable_key      │ ← @ symbol = secret reference
│ Preview: @clerk_publishable_key         │
└─────────────────────────────────────────┘
```

**CORRECT** (works):
```
┌─────────────────────────────────────────┐
│ VITE_CLERK_PUBLISHABLE_KEY              │
│ Production: pk_test_ZW5k...             │ ← Actual value
│ Preview: pk_test_ZW5k...                │
└─────────────────────────────────────────┘
```

## How to Add Variables Correctly

When adding a new environment variable in Vercel:

1. Click **Add New** button
2. Enter the **Name**: `VITE_CLERK_PUBLISHABLE_KEY`
3. In the **Value** field, paste: `pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk`
   - **DO NOT** type `@clerk_publishable_key`
   - **DO NOT** select "Reference existing secret"
   - Just paste the plain value
4. Select environments: ✓ Production ✓ Preview ✓ Development
5. Click **Save**

## Troubleshooting

### Still getting the error?

**Check 1**: Make sure you deleted the old variable
- Go to Environment Variables
- Look for any variable with `@clerk_publishable_key` in the value
- Delete it completely

**Check 2**: Make sure you're not creating a secret reference
- When adding the variable, paste the actual key value
- Don't use the @ symbol
- Don't select "Reference existing secret"

**Check 3**: Clear Vercel cache
- Settings → General → Build & Development Settings
- Clear build cache
- Redeploy

### How to Check if You Have Secret References

In Vercel Environment Variables page:
1. Look at the **Value** column
2. If you see `@something`, that's a secret reference
3. Delete it and add as plain text

## Alternative: Use Vercel CLI

If the dashboard isn't working, use CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Remove the problematic variable
vercel env rm VITE_CLERK_PUBLISHABLE_KEY production
vercel env rm VITE_CLERK_PUBLISHABLE_KEY preview
vercel env rm VITE_CLERK_PUBLISHABLE_KEY development

# Add it back as plain text
vercel env add VITE_CLERK_PUBLISHABLE_KEY production
# When prompted, paste: pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk

vercel env add VITE_CLERK_PUBLISHABLE_KEY preview
# Paste the same value

vercel env add VITE_CLERK_PUBLISHABLE_KEY development
# Paste the same value

# Add other variables
vercel env add VITE_API_URL production
# Paste: https://codex-res1.onrender.com

vercel env add VITE_API_URL preview
# Paste: https://codex-res1.onrender.com

# Redeploy
vercel --prod
```

## Why This Happens

Vercel has two ways to store values:
1. **Plain text** - The value is stored directly
2. **Secret reference** - Uses `@secret_name` to reference a secret

You accidentally created a secret reference (`@clerk_publishable_key`) but the secret doesn't exist.

**Solution**: Use plain text for Clerk publishable keys (they're meant to be public anyway).

## Quick Checklist

- [ ] Go to Vercel → Settings → Environment Variables
- [ ] **DELETE** existing `VITE_CLERK_PUBLISHABLE_KEY` (the one with @)
- [ ] Click **Add New**
- [ ] Name: `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] Value: `pk_test_ZW5kbGVzcy1ibG93ZmlzaC01OS5jbGVyay5hY2NvdW50cy5kZXYk` (paste actual value)
- [ ] Select all environments
- [ ] Save
- [ ] Add `VITE_API_URL` the same way
- [ ] Redeploy from Deployments tab
- [ ] Check deployment logs for success

## Expected Result

After fixing:
```
✓ Build completed successfully
✓ Deployment ready
✓ Your site is live at https://your-app.vercel.app
```

---

**Key Point**: DELETE the old variable first, then add it back as plain text! 🔑
