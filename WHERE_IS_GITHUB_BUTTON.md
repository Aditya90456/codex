# 📍 Where to Find GitHub Integration

## 🎯 Location in LeetCode Editor

### Top-Right Corner of Editor

```
┌─────────────────────────────────────────────────────────────┐
│  Playground                                                  │
│  ┌────────┐  ┌──────────────┐                              │
│  │  Home  │  │ Problem List │                              │
│  └────────┘  └──────────────┘                              │
│                                                              │
│                                    ┌────────┐  ┌─────────┐ │
│                                    │ GitHub │  │ Settings│ │ ← HERE!
│                                    └────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 What You'll See

### Before Connecting:
```
┌──────────┐
│  GitHub  │  ← Gray button
└──────────┘
```

### After Connecting:
```
┌────────────────┐
│ ✓ Connected    │  ← Green button with checkmark
└────────────────┘
```

## 📝 Step-by-Step Visual Guide

### 1. Open LeetCode Editor
```
Browser URL: http://localhost:5173/leetcode
```

### 2. Look at Top-Right
```
┌─────────────────────────────────────────┐
│                                          │
│  [Explain] [GitHub] [Settings] [⛶]     │  ← Top-right corner
│                      ↑                   │
│                   Click here!            │
└─────────────────────────────────────────┘
```

### 3. Click GitHub Button
```
First time:
┌──────────────────────────────┐
│  Connect GitHub              │
│                              │
│  Enable automatic syncing    │
│  of your accepted solutions  │
│                              │
│  [Enable Auto-Sync] [Cancel] │
└──────────────────────────────┘
```

### 4. After Submission (Accepted)
```
┌─────────────────────────────────────┐
│  ✅ Accepted                        │
│                                     │
│  Runtime: 52ms                      │
│  Memory: 42.1 MB                    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Download Solution for GitHub  │ │  ← Click to download!
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🎨 Button States

### State 1: Not Connected
```
┌──────────┐
│  GitHub  │  - Gray background
└──────────┘  - No icon
              - Click to connect
```

### State 2: Connected
```
┌────────────────┐
│ ✓ Connected    │  - Green background
└────────────────┘  - Checkmark icon
                    - Click to open settings
```

### State 3: Syncing
```
┌────────────────┐
│ ⟳ Syncing...   │  - Blue background
└────────────────┘  - Spinning icon
                    - Auto-syncing to GitHub
```

## 📱 Settings Panel

Click the **Settings** button (gear icon) to see:

```
┌─────────────────────────────────────┐
│  Settings                           │
├─────────────────────────────────────┤
│  Font Size: [────●──] 14px          │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  GitHub Integration                 │
│  ✓ Connected                        │
│                                     │
│  Account: Token Owner               │
│                                     │
│  Auto-sync on submit  [●─────]      │  ← Toggle this!
│                                     │
│  [Disconnect GitHub]                │
└─────────────────────────────────────┘
```

## 🎯 Download Button Location

After successful submission, scroll down in the **Test Result** tab:

```
┌─────────────────────────────────────┐
│  [Testcase] [Test Result] [AI Explain] │
│                  ↑                   │
│              Click here              │
├─────────────────────────────────────┤
│                                     │
│  ✅ Accepted                        │
│                                     │
│  Runtime: 52ms                      │
│  Memory: 42.1 MB                    │
│                                     │
│  Test Cases Passed: 3/3             │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⬇ Download Solution for GitHub│ │  ← HERE!
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🔔 Status Notifications

After syncing, you'll see a toast notification:

```
                              ┌─────────────────────────┐
                              │ ✅ Solution downloaded! │
                              │ Upload to your GitHub   │
                              │ repo.                   │
                              └─────────────────────────┘
                                        ↑
                                  Bottom-right corner
```

## 🎬 Complete Flow

```
1. Open Editor
   ↓
2. Click GitHub button (top-right)
   ↓
3. Click "Enable Auto-Sync"
   ↓
4. Solve a problem
   ↓
5. Click Submit
   ↓
6. Get "Accepted" ✅
   ↓
7. Click "Download Solution for GitHub"
   ↓
8. File downloads automatically! 🎉
```

## 🖼️ Visual Reference

```
┌─────────────────────────────────────────────────────────────┐
│  Playground                          [Home] [Problem List]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Problem Description          │  Code Editor                │
│                               │                             │
│  1. Two Sum                   │  Language: [JavaScript ▼]  │
│  Easy                         │                             │
│                               │  [Explain] [GitHub] [⚙]    │
│  Given an array...            │                             │
│                               │  function twoSum(nums) {    │
│  Examples:                    │      // Your code here      │
│  Input: [2,7,11,15], 9        │  }                          │
│  Output: [0,1]                │                             │
│                               │                             │
│                               ├─────────────────────────────┤
│                               │  [Testcase] [Test Result]  │
│                               │                             │
│                               │  ✅ Accepted                │
│                               │  Runtime: 52ms              │
│                               │                             │
│                               │  [Download for GitHub]      │
│                               │                             │
│                               │  [Dry Run] [Run] [Submit]  │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Checklist

Before looking for the button, make sure:
- [ ] Backend is running (`cd backend && npm start`)
- [ ] Frontend is running (`npm run dev`)
- [ ] You're on the LeetCode page (`/leetcode`)
- [ ] You've submitted code
- [ ] Submission was "Accepted" ✅

## 🆘 Can't Find It?

### If GitHub button is missing:
1. Refresh the page (F5)
2. Check browser console for errors (F12)
3. Verify you're on `/leetcode` route

### If Download button is missing:
1. Make sure submission was "Accepted"
2. Check the "Test Result" tab
3. Scroll down in the results panel

### If button is grayed out:
1. Start the backend server
2. Check `backend/.env` has `GITHUB_TOKEN`
3. Restart backend

## 🎉 You Found It!

Now you can:
1. Click the GitHub button to connect
2. Solve problems
3. Download solutions
4. Build your GitHub portfolio!

Happy coding! 🚀
