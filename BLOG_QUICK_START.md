# Blog Platform - Quick Start Guide

## Problem: "Failed to fetch. Please ensure the backend server is running."

This means the backend server is not running. Here's how to fix it:

---

## ⚡ FASTEST FIX (One Click)

**Double-click this file:**
```
START_BLOG_PLATFORM.bat
```

This will:
1. ✅ Start backend server (Port 3001)
2. ✅ Start frontend dev server (Port 5173)
3. ✅ Open browser to blogs page
4. ✅ Everything ready to use!

---

## 🔧 Manual Start (If Script Doesn't Work)

### Step 1: Start Backend Server

**Open Terminal 1:**
```bash
cd backend
node server.js
```

You should see:
```
✅ Server running on port 3001
✅ Blog routes mounted at /api/blogs
```

### Step 2: Start Frontend

**Open Terminal 2:**
```bash
npm run dev
```

You should see:
```
VITE ready in XXXms
Local: http://localhost:5173
```

### Step 3: Test Blogs

Open browser: http://localhost:5173/blogs

---

## 🧪 Test Backend (Optional)

**Verify backend is working:**
```bash
node test-backend-blogs.js
```

This will test all blog API endpoints.

---

## ❌ Common Errors & Fixes

### Error: "Failed to fetch"
**Cause:** Backend not running
**Fix:** 
```bash
cd backend
node server.js
```

### Error: "Cannot find module 'express'"
**Cause:** Dependencies not installed
**Fix:**
```bash
cd backend
npm install
```

### Error: "Port 3001 already in use"
**Cause:** Another process using port 3001
**Fix:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in backend/server.js
```

### Error: "CORS policy"
**Cause:** Frontend and backend on different origins
**Fix:** Already configured in backend/server.js
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
```

---

## 📁 File Structure

```
backend/
  ├── server.js           # Main server file
  ├── routes/
  │   └── blogs.js        # Blog API routes
  └── data/
      └── blogs/          # Blog data storage (auto-created)
          └── {userId}.json

src/
  └── components/
      └── BlogPlatform.jsx  # Blog UI component
```

---

## 🔍 Verify Setup

### 1. Check Backend is Running
Open: http://localhost:3001/api/blogs/all

Should return:
```json
{
  "success": true,
  "blogs": [],
  "total": 0
}
```

### 2. Check Frontend is Running
Open: http://localhost:5173

Should show home page

### 3. Check Blog Page
Open: http://localhost:5173/blogs

Should show blog platform UI

---

## 📝 Create Your First Blog

1. **Sign in** with Clerk (top right)
2. **Click** "Create Blog" button
3. **Fill in:**
   - Title: "My First Blog"
   - Content: "Hello World!"
   - Tags: javascript, react
4. **Click** "Publish Blog"
5. **See** your blog in the list!

---

## 🚀 Features Working

After starting both servers, you can:

- ✅ Create blogs with title, content, tags, cover image
- ✅ Like/Dislike blogs
- ✅ Comment on blogs
- ✅ Follow/Unfollow authors
- ✅ View personalized feed
- ✅ See trending blogs
- ✅ Search by tags
- ✅ View user profiles with stats

---

## 🐛 Still Having Issues?

### Check Environment Variables

**File: `.env`**
```env
VITE_API_URL=http://127.0.0.1:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Check Backend Logs

Look for errors in the terminal where backend is running:
```
✅ Server running on port 3001
✅ Blog routes mounted at /api/blogs
```

### Check Frontend Console

Open browser DevTools (F12) → Console tab
Look for errors like:
- "Failed to fetch" → Backend not running
- "CORS error" → CORS not configured
- "Network error" → Wrong API URL

---

## 📞 Need Help?

1. **Run diagnostic:**
   ```bash
   node test-backend-blogs.js
   ```

2. **Check both servers are running:**
   - Backend: http://localhost:3001/api/blogs/all
   - Frontend: http://localhost:5173

3. **Check browser console** (F12) for errors

4. **Share error message** for specific help

---

## ✅ Success Checklist

- [ ] Backend server running on port 3001
- [ ] Frontend dev server running on port 5173
- [ ] Can access http://localhost:5173/blogs
- [ ] Can sign in with Clerk
- [ ] Can click "Create Blog" button
- [ ] Can create and publish a blog
- [ ] Blog appears in the list

---

## 🎯 Quick Commands

```bash
# Start everything (one command)
START_BLOG_PLATFORM.bat

# Or manually:
# Terminal 1
cd backend && node server.js

# Terminal 2
npm run dev

# Test backend
node test-backend-blogs.js
```

---

## Summary

The blog platform needs **both** frontend and backend running:
1. Backend (Port 3001) - Stores blog data
2. Frontend (Port 5173) - Shows blog UI

Use `START_BLOG_PLATFORM.bat` to start both automatically! 🚀
