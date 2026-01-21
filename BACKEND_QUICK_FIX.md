# Backend Not Running - Quick Fix

## The Problem
You're seeing: "Failed to generate content. Make sure the backend server is running on port 3001."

This means the backend server isn't started.

## Quick Solution (3 Steps)

### Step 1: Open New Terminal
Open a **new terminal/command prompt** window

### Step 2: Navigate to Backend
```bash
cd backend-new
```

### Step 3: Start Server
```bash
npm start
```

You should see:
```
🚀 Codex Playground Backend v2.0.0 running on port 3001
```

## Even Easier: Use the Startup Script

Just double-click: **`start-all.bat`** in your project root

This will:
- Install dependencies if needed
- Start the backend server
- Open in a new window

## Verify It's Working

### Method 1: Check in Browser
Open: http://localhost:3001/health

You should see JSON response with server status.

### Method 2: Use Check Script
Double-click: **`check-backend.bat`**

This will test if the backend is running.

## First Time Setup?

If you haven't installed dependencies yet:

```bash
cd backend-new
npm install
npm start
```

## Now Test AI Creator

1. Make sure backend is running (see above)
2. Go to your frontend (http://localhost:5173)
3. Click "AI Creator" button
4. Try generating something!

## Still Not Working?

### Check Port 3001
Maybe something else is using port 3001:

```bash
netstat -ano | findstr :3001
```

If something is there, kill it:
```bash
taskkill /PID <number> /F
```

### Check Dependencies
```bash
cd backend-new
npm install
```

### Check for Errors
Look at the terminal where backend is running for error messages.

## Running Both Servers

You need TWO terminals:

**Terminal 1 (Backend):**
```bash
cd backend-new
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Quick Commands

| Command | What it does |
|---------|-------------|
| `start-all.bat` | Start backend automatically |
| `check-backend.bat` | Check if backend is running |
| `cd backend-new && npm start` | Start backend manually |
| `npm run dev` | Start frontend |

---

**TL;DR**: Open new terminal → `cd backend-new` → `npm start` → Done! ✅
