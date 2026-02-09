# 🚀 Quick Deploy to Vercel - 5 Minutes

## Step 1: Deploy Backend (2 min)

1. Go to https://render.com
2. New + → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add env vars:
   - `PORT=3001`
   - `NODE_ENV=production`
6. Deploy → Copy URL

## Step 2: Deploy Frontend (2 min)

1. Go to https://vercel.com
2. New Project → Import your repo
3. Add env vars:
   - `VITE_API_URL` = your Render URL
   - `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk key
4. Deploy → Copy URL

## Step 3: Configure Clerk (1 min)

1. Go to https://dashboard.clerk.com
2. Domains → Add your Vercel URL
3. Paths → Update redirect URLs

## Done! 🎉

Test: `https://your-project.vercel.app/blogs`

---

## Environment Variables Needed

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_GEMINI_API_KEY=AIzaSy... (optional)
```

### Render (Backend)
```
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=AIzaSy...
CLERK_SECRET_KEY=sk_test_...
```

---

## Quick Test

1. Open: `https://your-project.vercel.app`
2. Sign in
3. Go to `/blogs`
4. Create a blog
5. ✅ Success!

---

## Troubleshooting

**"Failed to fetch"**
→ Check `VITE_API_URL` in Vercel

**CORS error**
→ Add Vercel URL to backend CORS

**Clerk not working**
→ Add Vercel domain to Clerk

---

## Full Guide

See `BLOG_VERCEL_DEPLOYMENT.md` for detailed instructions.
