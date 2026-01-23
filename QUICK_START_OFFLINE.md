can't switch # 🚀 Quick Start - Offline Mode

## Your website is NOW running in OFFLINE MODE! 🎉

### ✅ What This Means:
- No internet connection needed
- Works completely offline
- Data stored locally in your browser
- All features available

### 🌐 Access Your Website:
**Open in browser:** http://localhost:5174

### 🔐 First Time Setup:
1. Click **"Sign Up"** or **"Create New"**
2. Enter any username, email, and password
3. Click Sign Up
4. You're in! 🎊

### 📝 Test Credentials (Create These):
```
Username: demo
Email: demo@example.com
Password: demo123
```

### 🎨 Available Features:
- ✅ Code Editors (Codex, VS Code, Web IDE)
- ✅ Android Editor
- ✅ DSA Problems & Tutorials
- ✅ AI Creator
- ✅ All navigation and features

### 🔄 To Switch to Online Mode:
1. Stop server (Ctrl+C in terminal)
2. Edit `src/main.jsx`
3. Change: `USE_OFFLINE_MODE = false`
4. Run: `npm run dev`

### 🛠️ Troubleshooting:
**Can't see the website?**
- Make sure server is running: `npm run dev`
- Check port: http://localhost:5174
- Try: http://localhost:5173

**Can't login?**
- Create account first (Sign Up)
- Check username/password spelling
- Clear browser data and try again

### 📱 How Offline Auth Works:
- Accounts saved in browser's localStorage
- No server/database needed
- Data persists until you clear browser
- Each browser = separate accounts

### 🎯 Current Status:
```
✅ Server: Running on port 5174
✅ Mode: OFFLINE
✅ Backend: Optional (not needed for offline)
✅ Internet: Not required
```

---

**Ready to code!** Open http://localhost:5174 and start building! 🚀
