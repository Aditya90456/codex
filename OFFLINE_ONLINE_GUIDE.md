# Codex - Offline & Online Mode Guide

Your website now supports **both offline and online modes**!

## 🚀 Quick Start

### Option 1: Using Batch Files (Easiest)

**For Offline Mode (No Internet Required):**
```bash
start-offline.bat
```

**For Online Mode (With Clerk Authentication):**
```bash
start-online.bat
```

### Option 2: Manual Configuration

Edit `src/main.jsx` and change this line:

```javascript
const USE_OFFLINE_MODE = true;  // Set to true for offline, false for online
```

Then run:
```bash
npm run dev
```

## 📱 Features

### Offline Mode Features
- ✅ Works without internet connection
- ✅ Local authentication (stored in browser)
- ✅ All editors work (Codex, VS Code, Web IDE, Android)
- ✅ DSA problems and tutorials
- ✅ AI Creator (local only)
- ✅ Full navigation
- ✅ Data persists in localStorage

### Online Mode Features
- ✅ Clerk authentication (secure cloud auth)
- ✅ Social login (Google, GitHub, etc.)
- ✅ Cloud data sync
- ✅ All offline features plus cloud features

## 🔐 Offline Authentication

### Creating an Account (Offline)
1. Click "Sign Up" or "Create New"
2. Enter:
   - Username
   - Email
   - Password
3. Your account is stored locally in your browser

### Signing In (Offline)
1. Click "Sign In"
2. Enter your username and password
3. Access all features

### Data Storage
- Accounts stored in: `localStorage.offline_users`
- Current user: `localStorage.offline_current_user`
- Data persists until you clear browser data

## 🌐 Online Authentication

### Using Clerk (Online Mode)
1. Requires internet connection
2. Supports social login
3. Data synced to cloud
4. More secure for production

## 🔄 Switching Modes

### From Offline to Online:
1. Stop the dev server (Ctrl+C)
2. Edit `src/main.jsx`
3. Change `USE_OFFLINE_MODE = false`
4. Run `npm run dev`

### From Online to Offline:
1. Stop the dev server (Ctrl+C)
2. Edit `src/main.jsx`
3. Change `USE_OFFLINE_MODE = true`
4. Run `npm run dev`

## 🛠️ Troubleshooting

### Offline Mode Not Working?
1. Check browser console for errors (F12)
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page
4. Make sure `USE_OFFLINE_MODE = true` in `src/main.jsx`

### Can't Sign In (Offline)?
1. Make sure you created an account first
2. Check username/password spelling
3. Open DevTools → Application → Local Storage
4. Look for `offline_users` key

### Want to Reset Offline Data?
Open browser console (F12) and run:
```javascript
localStorage.removeItem('offline_users');
localStorage.removeItem('offline_current_user');
```

## 📊 Current Status

**Server Running:** http://localhost:5174
**Mode:** Offline (as configured in main.jsx)
**Backend:** http://localhost:3001 (if started)

## 🎯 Use Cases

### Offline Mode Best For:
- Development without internet
- Testing locally
- Demos and presentations
- Learning and practice
- No cloud dependency

### Online Mode Best For:
- Production deployment
- Multi-device sync
- Social authentication
- Team collaboration
- Secure cloud storage

## 📝 Notes

- Offline mode uses browser localStorage
- Data is device-specific in offline mode
- Online mode requires valid Clerk API keys
- You can switch modes anytime during development

## 🚨 Important

**Offline Mode Security:**
- Passwords stored in plain text in localStorage
- Only use for development/testing
- Not recommended for production
- Use Online Mode (Clerk) for production

**Online Mode:**
- Secure authentication
- Encrypted passwords
- Production-ready
- Requires Clerk account

---

**Need Help?** Check the console for errors or create an issue on GitHub.
