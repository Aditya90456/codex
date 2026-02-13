# Fix Stats Not Updating - Step by Step

## Problem
Stats (blogs, groups, DSA progress) are not updating on the welcome screen.

## Solution Steps

### Step 1: Initialize User Stats in Clerk

Run this command to set up the metadata fields for all users:

```bash
cd backend
node init-user-stats.js all
```

Or for a specific user:
```bash
node init-user-stats.js user YOUR_USER_ID
```

To get your user ID:
1. Go to https://dashboard.clerk.com
2. Click "Users"
3. Click on your user
4. Copy the User ID (starts with `user_`)

### Step 2: Restart Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server running on port 3001
```

### Step 3: Test the System

#### Test 1: Create a Blog
1. Go to http://localhost:5173/blogs
2. Click "Create Blog"
3. Fill in title and content
4. Click "Publish Blog"
5. **Check backend console** - you should see:
   ```
   📈 Incrementing blogsWritten by 1 for user user_xxx
      Current: 0 → New: 1
   ✅ blogsWritten updated successfully
   ```
6. Go to welcome screen (/)
7. **Blogs Written** should show 1

#### Test 2: Read a Blog
1. Click on any blog to open it
2. **Check backend console** - you should see:
   ```
   📈 Incrementing blogsRead by 1 for user user_xxx
   ```
3. Refresh welcome screen
4. **Blogs Read** should increase

#### Test 3: Like a Blog
1. Click the heart icon on a blog
2. **Check backend console** - you should see:
   ```
   📈 Incrementing blogsLiked by 1 for user user_xxx
   ```
3. Refresh welcome screen
4. **Blogs Liked** should increase

#### Test 4: Join a Study Group
1. Go to http://localhost:5173/study-groups
2. Click "Join" on any group (or create one first)
3. **Check backend console** - you should see:
   ```
   📈 Incrementing studyGroups by 1 for user user_xxx
   ```
4. Refresh welcome screen
5. **Study Groups** should increase

### Step 4: Verify in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Click "Users"
3. Click on your user
4. Scroll to "Public metadata"
5. You should see:
   ```json
   {
     "blogsWritten": 1,
     "blogsRead": 2,
     "blogsLiked": 1,
     "studyGroups": 1,
     "solvedProblems": 0,
     "streak": 0,
     "rating": 1200
   }
   ```

## If Still Not Working

### Check 1: CLERK_SECRET_KEY

```bash
cd backend
type .env | findstr CLERK_SECRET_KEY
```

Should show a key starting with `sk_test_` or `sk_live_`

If missing, add to `backend/.env`:
```
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

Get your key from: https://dashboard.clerk.com → API Keys

### Check 2: Backend Logs

When you perform an action, you should see logs like:
```
📈 Incrementing blogsWritten by 1 for user user_xxx
   Current: 0 → New: 1
✅ blogsWritten updated successfully
```

If you see:
```
⚠️  Clerk not initialized, skipping stat increment
```

Then CLERK_SECRET_KEY is not set correctly.

### Check 3: Frontend Console

Open browser console (F12) and check for errors when viewing welcome screen.

### Check 4: Hard Refresh

Sometimes Clerk caches data. Try:
1. Hard refresh (Ctrl+Shift+R)
2. Sign out and sign back in
3. Clear browser cache

## Manual Fix

If automatic sync isn't working, you can manually set stats in Clerk Dashboard:

1. Go to https://dashboard.clerk.com
2. Users → Your user → Public metadata → Edit
3. Add/update:
   ```json
   {
     "blogsWritten": 5,
     "blogsRead": 10,
     "blogsLiked": 3,
     "studyGroups": 2,
     "solvedProblems": 15,
     "streak": 5,
     "rating": 1200
   }
   ```
4. Save
5. Refresh welcome screen

## Expected Behavior

After fixing:
- ✅ Creating a blog → `blogsWritten` increases
- ✅ Reading a blog → `blogsRead` increases
- ✅ Liking a blog → `blogsLiked` toggles
- ✅ Joining a group → `studyGroups` increases
- ✅ Leaving a group → `studyGroups` decreases
- ✅ Solving DSA problem → `solvedProblems` increases
- ✅ All stats show on welcome screen instantly

## Quick Test Command

Run this to test Clerk connection:
```bash
cd backend
node test-clerk-sync.js
```

(Update the user ID in the file first)

## Need Help?

1. Check backend console for error messages
2. Check browser console for errors
3. Verify CLERK_SECRET_KEY is correct
4. Make sure backend is running on port 3001
5. Make sure you're signed in with Clerk
