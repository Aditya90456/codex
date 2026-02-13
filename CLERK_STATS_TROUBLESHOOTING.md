# Clerk Stats Not Updating - Troubleshooting Guide

## Quick Checks

### 1. Check Backend Logs
When you perform an action (create blog, join group, etc.), you should see logs like:
```
📈 Incrementing blogsWritten by 1 for user user_xxx
   Current: 0 → New: 1
✅ blogsWritten updated successfully
```

If you don't see these logs, the sync function isn't being called.

### 2. Verify CLERK_SECRET_KEY
```bash
cd backend
type .env | findstr CLERK_SECRET_KEY
```

Should show:
```
CLERK_SECRET_KEY=sk_test_...
```

### 3. Test Clerk Sync Directly
```bash
cd backend
node test-clerk-sync.js
```

Update the `testUserId` in the file first with your actual Clerk user ID.

### 4. Check Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Click on your application
3. Go to "Users"
4. Click on your user
5. Scroll to "Public metadata"
6. You should see fields like `blogsWritten`, `blogsRead`, etc.

## Common Issues

### Issue 1: Stats Show 0 Even After Actions

**Cause**: Clerk metadata not initialized or sync failing

**Solution**:
1. Check backend console for error messages
2. Verify CLERK_SECRET_KEY is correct
3. Manually set initial values in Clerk Dashboard:
   ```json
   {
     "blogsWritten": 0,
     "blogsRead": 0,
     "blogsLiked": 0,
     "studyGroups": 0,
     "solvedProblems": 0,
     "streak": 0
   }
   ```

### Issue 2: Backend Not Logging Sync Messages

**Cause**: Clerk sync functions not being called

**Solution**:
1. Restart backend server: `npm start`
2. Check that routes are importing clerk-sync:
   ```javascript
   const { incrementUserStat } = require('../utils/clerk-sync');
   ```
3. Verify the sync calls are in the right places

### Issue 3: "Clerk not initialized" Warning

**Cause**: CLERK_SECRET_KEY missing or invalid

**Solution**:
1. Copy your secret key from Clerk Dashboard
2. Update `backend/.env`:
   ```
   CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
   ```
3. Restart backend server

### Issue 4: Frontend Shows Old Values

**Cause**: Clerk cache not refreshed

**Solution**:
1. Hard refresh the page (Ctrl+Shift+R)
2. Sign out and sign back in
3. Clear browser cache
4. Wait a few seconds for Clerk to sync

### Issue 5: "Invalid user ID" Error

**Cause**: Using wrong user ID format

**Solution**:
- Clerk user IDs start with `user_`
- Get your user ID from:
  - Clerk Dashboard → Users → Click user → Copy ID
  - Or from `user.id` in frontend console

## Manual Testing Steps

### Test Blog Stats

1. **Create a Blog**:
   - Go to `/blogs`
   - Click "Create Blog"
   - Fill in title and content
   - Click "Publish"
   - Check backend logs for: `📈 Incrementing blogsWritten`
   - Refresh welcome screen
   - `blogsWritten` should increase by 1

2. **Read a Blog**:
   - Click on any blog to open it
   - Check backend logs for: `📈 Incrementing blogsRead`
   - Refresh welcome screen
   - `blogsRead` should increase by 1

3. **Like a Blog**:
   - Click the heart icon on a blog
   - Check backend logs for: `📈 Incrementing blogsLiked`
   - Refresh welcome screen
   - `blogsLiked` should increase by 1

### Test Study Groups

1. **Join a Group**:
   - Go to `/study-groups`
   - Click "Join" on any group
   - Check backend logs for: `📈 Incrementing studyGroups`
   - Refresh welcome screen
   - `studyGroups` should increase by 1

2. **Leave a Group**:
   - Go to "My Groups" tab
   - Click "Leave Group"
   - Check backend logs for: `📉 Decrementing studyGroups`
   - Refresh welcome screen
   - `studyGroups` should decrease by 1

## Debug Mode

Add this to your backend route to see what's happening:

```javascript
// In any route that should update stats
console.log('User ID:', userId);
console.log('About to increment stat...');
const result = await incrementUserStat(userId, 'blogsWritten');
console.log('Increment result:', result);
```

## Force Refresh Stats

If stats are stuck, you can manually reset them in Clerk Dashboard:

1. Go to https://dashboard.clerk.com
2. Users → Select your user
3. Public metadata → Edit
4. Set all stats to 0:
   ```json
   {
     "blogsWritten": 0,
     "blogsRead": 0,
     "blogsLiked": 0,
     "studyGroups": 0,
     "solvedProblems": 0,
     "streak": 0,
     "rating": 1200
   }
   ```
5. Save
6. Perform actions to test incrementing

## Still Not Working?

1. **Check Network**: Make sure backend can reach Clerk API
2. **Check Clerk Status**: https://status.clerk.com
3. **Verify API Key**: Make sure it's a SECRET key (starts with `sk_test_` or `sk_live_`)
4. **Check Logs**: Look for any error messages in backend console
5. **Test Direct API Call**: Use the test script to isolate the issue

## Contact Support

If nothing works:
1. Check backend console output
2. Check browser console for errors
3. Verify all files are saved
4. Restart both frontend and backend
5. Try with a fresh user account
