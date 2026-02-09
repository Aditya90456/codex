# Blog Platform Deployment Guide

## Issue: "Failed create blog deployment"

The blog platform requires a backend server to store and manage blog data. Here's how to deploy it properly.

---

## Option 1: Deploy Both Frontend + Backend (Recommended)

### Step 1: Deploy Backend to Render/Railway/Heroku

#### Using Render.com (Free):

1. **Create `backend/package.json`** (if not exists):
```json
{
  "name": "codex-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

2. **Push backend to GitHub** (separate repo or monorepo)

3. **Create Web Service on Render**:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Set Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `PORT=3001`
     - `NODE_ENV=production`

4. **Get your backend URL**: `https://your-app.onrender.com`

### Step 2: Deploy Frontend to Vercel/Netlify

#### Using Vercel:

1. **Create `.env.production`** in root:
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

2. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel
```

3. **Add Environment Variables in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL
   - Add `VITE_CLERK_PUBLISHABLE_KEY`

---

## Option 2: Frontend-Only Deployment (No Backend)

If you want to deploy without a backend, you need to use a different storage solution.

### Use LocalStorage (Client-Side Only):

Create `src/services/blogStorage.js`:

```javascript
// Client-side blog storage using localStorage
class BlogStorage {
  constructor() {
    this.STORAGE_KEY = 'codex_blogs';
  }

  getAllBlogs() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveBlog(blog) {
    const blogs = this.getAllBlogs();
    blogs.unshift(blog);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(blogs));
    return blog;
  }

  deleteBlog(blogId) {
    const blogs = this.getAllBlogs();
    const filtered = blogs.filter(b => b.id !== blogId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  updateBlog(blogId, updates) {
    const blogs = this.getAllBlogs();
    const index = blogs.findIndex(b => b.id === blogId);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(blogs));
    }
  }
}

export default new BlogStorage();
```

Then modify `BlogPlatform.jsx` to use this instead of API calls.

---

## Option 3: Use Vercel Serverless Functions

### Step 1: Create API Routes

Create `api/blogs/create.js`:

```javascript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = '/tmp/blogs';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userName, userAvatar, title, content, tags, coverImage } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'userId, title, and content are required'
      });
    }

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    const newBlog = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || '',
      title,
      content,
      tags: tags || [],
      coverImage: coverImage || '',
      likes: [],
      dislikes: [],
      comments: [],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Read existing blogs
    const filePath = join(DATA_DIR, `${userId}.json`);
    let userData = { blogs: [], followers: [], following: [] };
    
    if (existsSync(filePath)) {
      userData = JSON.parse(readFileSync(filePath, 'utf-8'));
    }

    userData.blogs = userData.blogs || [];
    userData.blogs.unshift(newBlog);

    // Save blogs
    writeFileSync(filePath, JSON.stringify(userData, null, 2));

    res.status(200).json({
      success: true,
      blog: newBlog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

### Step 2: Update API_URL

In `BlogPlatform.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

---

## Quick Fix for Current Deployment

If you're getting errors right now, add error handling:

### Update `.env` file:
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
```

### For Production `.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
VITE_CLERK_PUBLISHABLE_KEY=your_production_key
```

---

## Troubleshooting

### Error: "Failed to fetch"
- **Cause**: Backend not running or wrong URL
- **Fix**: Check `VITE_API_URL` environment variable

### Error: "CORS policy"
- **Cause**: Backend not allowing frontend origin
- **Fix**: Add CORS middleware in `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  credentials: true
}));
```

### Error: "Network request failed"
- **Cause**: Backend server is down
- **Fix**: Ensure backend is deployed and running

---

## Recommended Deployment Stack

1. **Frontend**: Vercel (Free, automatic deployments)
2. **Backend**: Render.com (Free tier available)
3. **Database**: File-based (current) or upgrade to MongoDB Atlas (free tier)

---

## Environment Variables Checklist

### Frontend (.env.production):
- ✅ `VITE_API_URL` - Backend URL
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` - Clerk auth key

### Backend (.env):
- ✅ `PORT` - Server port (3001)
- ✅ `NODE_ENV` - production
- ✅ `ALLOWED_ORIGINS` - Frontend URLs

---

## Next Steps

1. Choose deployment option (1, 2, or 3)
2. Set up environment variables
3. Deploy backend first, then frontend
4. Test blog creation in production
5. Monitor logs for errors

Need help with a specific deployment platform? Let me know!
