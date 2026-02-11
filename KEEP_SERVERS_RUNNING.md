# Keep Servers Running - Solution

## Problem
Backend and frontend servers stop when terminal closes or after inactivity.

## ✅ Solution: Use the Batch Script

### Quick Start
**Double-click this file:**
```
START_BLOG_PLATFORM.bat
```

This opens 2 separate terminal windows:
1. Backend Server (Port 3001)
2. Frontend Dev Server (Port 5173)

**Keep both windows open** while using the blog platform.

---

## Current Status

### ✅ Servers Running Now

**Backend:** http://localhost:3001
- Process ID: 1
- Status: Running
- Routes: Blog Platform mounted

**Frontend:** http://localhost:5173
- Process ID: 3
- Status: Running
- Ready in 3399 ms

### Access Your Blog
**URL:** http://localhost:5173/blogs

---

## Manual Start (If Needed)

### Terminal 1 - Backend
```bash
cd backend
node server.js
```

Keep this terminal open!

### Terminal 2 - Frontend
```bash
npm run dev
```

Keep this terminal open!

---

## Why Servers Stop

1. **Terminal closed** - Servers stop when terminal window closes
2. **Process killed** - Ctrl+C stops the server
3. **System sleep** - Computer sleep may stop servers
4. **Timeout** - Some terminals auto-close after inactivity

---

## Best Practices

### ✅ DO:
- Keep terminal windows open
- Use `START_BLOG_PLATFORM.bat` for easy start
- Check if servers are running before testing

### ❌ DON'T:
- Close terminal windows
- Press Ctrl+C in server terminals
- Put computer to sleep while testing

---

## Quick Check

### Is Backend Running?
Open: http://localhost:3001/health

Should return:
```json
{"status":"ok"}
```

### Is Frontend Running?
Open: http://localhost:5173

Should show home page.

---

## Restart Servers

If servers stop, just run:
```bash
START_BLOG_PLATFORM.bat
```

Or manually:
```bash
# Terminal 1
cd backend && node server.js

# Terminal 2
npm run dev
```

---

## For Production (Vercel)

Once deployed to Vercel:
- ✅ Servers run 24/7
- ✅ No need to keep terminals open
- ✅ Automatic restarts
- ✅ Always available

See: `BLOG_VERCEL_DEPLOYMENT.md`

---

## Summary

**Current Status:** ✅ Both servers running

**To keep running:**
1. Don't close terminal windows
2. Don't press Ctrl+C
3. Use `START_BLOG_PLATFORM.bat` for easy restart

**Access blog:** http://localhost:5173/blogs
