# 🔐 Clerk Authentication Setup Guide

## Step-by-Step Setup from Clerk.com

### 1. Create Clerk Account

1. Go to **https://clerk.com** or **https://dashboard.clerk.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - Email and password
   - Or use Google/GitHub sign-in
4. Verify your email if required

### 2. Create Your Application

1. After signing in, you'll see the Clerk Dashboard
2. Click **"+ Create Application"** or **"New Application"**
3. Fill in the details:
   - **Application Name**: `Codex Playground` (or your app name)
   - **Application Type**: Select "Web Application"
4. Click **"Create Application"**

### 3. Get Your API Keys

Once your application is created:

1. You'll be redirected to the **API Keys** page
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

3. **Copy the Publishable Key** - this is what you need for the frontend

### 4. Configure Your .env File

1. Open your `.env` file in the project root
2. Replace the existing key with your new key:

```env
# Replace this with your actual key from Clerk dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE

# Keep these as is
VITE_API_BASE_URL=http://localhost:3001
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
```

### 5. Configure Allowed Domains (Important!)

1. In Clerk Dashboard, go to **"Domains"** in the sidebar
2. Add your development domain:
   - For local development: `http://localhost:5173`
   - For Vite default: `http://localhost:5173`
   - For custom port: `http://localhost:YOUR_PORT`

3. Click **"Add Domain"**

### 6. Configure Sign-In/Sign-Up Options

1. In Clerk Dashboard, go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Enable the authentication methods you want:
   - ✅ **Email address** (recommended)
   - ✅ **Username** (optional)
   - ✅ **Phone number** (optional)

3. Go to **"Social Connections"**
4. Enable social providers (optional):
   - Google
   - GitHub
   - Facebook
   - etc.

### 7. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 8. Test Authentication

1. Open your app: `http://localhost:5173`
2. Click **"Sign Up"** button in the top-right
3. You should see the Clerk sign-up modal
4. Create a test account
5. You should be signed in and see your profile button

## 🎯 Quick Reference

### Where to Find Your Keys

```
Clerk Dashboard → Your Application → API Keys
```

### Key Format

```
Publishable Key: pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Secret Key:      sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### .env File Location

```
your-project/
├── .env          ← Add your key here
├── src/
├── package.json
└── ...
```

## 🔧 Troubleshooting

### Issue: "Clerk key not found"

**Solution:**
1. Check `.env` file exists in project root
2. Verify key starts with `VITE_` prefix
3. Restart dev server after adding key

### Issue: "Invalid publishable key"

**Solution:**
1. Copy the key again from Clerk dashboard
2. Make sure you copied the **Publishable Key** (not Secret Key)
3. Remove any extra spaces or line breaks
4. Key should start with `pk_test_`

### Issue: "Domain not allowed"

**Solution:**
1. Go to Clerk Dashboard → Domains
2. Add `http://localhost:5173` (or your port)
3. Save and try again

### Issue: Sign-up modal not appearing

**Solution:**
1. Check browser console for errors
2. Verify Clerk key is loaded: `console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)`
3. Clear browser cache and reload
4. Check if ad blocker is interfering

## 📝 Environment Variables Explained

```env
# Frontend - Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
# ↑ This is PUBLIC and safe to expose in frontend
# Used for: Sign in, sign up, user management

# Backend - Clerk Secret (if needed)
CLERK_SECRET_KEY=sk_test_...
# ↑ This is PRIVATE - never expose in frontend
# Used for: Server-side user verification

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
# ↑ Your backend API URL

# AI Configuration
GEMINI_API_KEY=your_gemini_key
# ↑ Google Gemini AI API key
```

## 🚀 Production Deployment

### For Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_live_YOUR_PRODUCTION_KEY
   ```
3. In Clerk Dashboard, add your production domain:
   ```
   https://your-app.vercel.app
   ```

### For Render:

1. Go to Render Dashboard → Your Service → Environment
2. Add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_live_YOUR_PRODUCTION_KEY
   ```
3. In Clerk Dashboard, add your production domain:
   ```
   https://your-app.onrender.com
   ```

## 🎨 Customization

### Change Theme Colors

In `src/App.jsx`, modify the `clerkAppearance` object:

```jsx
const clerkAppearance = {
  variables: {
    colorPrimary: '#3b82f6',      // Change primary color
    colorBackground: '#1f2937',    // Change background
    colorInputBackground: '#374151', // Change input background
    colorInputText: '#ffffff',     // Change text color
    borderRadius: '0.75rem',       // Change border radius
  },
};
```

### Enable/Disable Social Login

1. Clerk Dashboard → Social Connections
2. Toggle providers on/off
3. Configure OAuth credentials for each provider

## 📚 Additional Resources

- **Clerk Documentation**: https://clerk.com/docs
- **React Integration**: https://clerk.com/docs/quickstarts/react
- **API Reference**: https://clerk.com/docs/reference/clerk-react
- **Support**: https://clerk.com/support

## ✅ Checklist

- [ ] Created Clerk account
- [ ] Created application in Clerk dashboard
- [ ] Copied publishable key
- [ ] Added key to `.env` file
- [ ] Added localhost domain in Clerk
- [ ] Restarted dev server
- [ ] Tested sign up
- [ ] Tested sign in
- [ ] Tested sign out

---

**Need Help?** Check the Clerk documentation or contact their support team.

**Status**: Ready to use
**Last Updated**: January 26, 2026
