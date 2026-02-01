# Automatic GitHub Integration Setup 🚀

## Quick Setup (5 Minutes)

### Step 1: Get GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token (classic)"
   - Name: `LeetCode Solutions Sync`
   - Expiration: `No expiration` (or your preference)

3. **Select Scopes**
   - ✅ Check `repo` (Full control of private repositories)
   - This is the ONLY scope needed

4. **Generate & Copy**
   - Click "Generate token"
   - **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
   - Example: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Configure Backend

1. **Open backend folder**
   ```bash
   cd backend
   ```

2. **Create/Edit `.env` file**
   ```bash
   # If file doesn't exist, create it
   notepad .env
   ```

3. **Add your GitHub token**
   ```env
   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   
   # Add this line with YOUR token:
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```

4. **Save the file**

### Step 3: Start Backend

```bash
# In backend folder
npm start
```

You should see:
```
✅ Server running on port 3001
✅ AI Generator routes mounted
✅ GitHub integration routes mounted
```

### Step 4: Connect in Frontend

1. **Open Playground**
   ```
   http://localhost:5173/playground
   ```

2. **Click GitHub Button** (in editor toolbar)
   - Or click Settings ⚙️ → GitHub Integration

3. **Enter Your GitHub Username**
   - NOT your email
   - Just username (e.g., `octocat`)
   - Click "Connect"

4. **Verify Connection**
   - Button turns green: "✅ Connected"
   - Auto-sync is enabled by default

### Step 5: Test It!

1. **Solve a Problem**
   - Use any problem
   - Write solution

2. **Submit**
   - Click "Submit" button
   - Wait for all tests to pass

3. **Watch for Sync**
   - Bottom-right notification appears
   - "🔵 Syncing to GitHub..."
   - Then: "✅ Synced to GitHub!" with link

4. **Check GitHub**
   - Go to: `https://github.com/YOUR_USERNAME/leetcode-solutions`
   - Repository created automatically!
   - Your solution is there!

## File Structure Created

```
leetcode-solutions/
├── Easy/
│   ├── Array/
│   │   └── 1-two-sum.js
│   └── String/
│       └── 125-valid-palindrome.js
├── Medium/
│   ├── Dynamic-Programming/
│   │   └── 322-coin-change.js
│   └── Tree/
│       └── 102-binary-tree-level-order-traversal.js
└── Hard/
    └── Graph/
        └── 127-word-ladder.js
```

## Troubleshooting

### Error: "GitHub token not configured"

**Solution:**
```bash
# Check if .env file exists
cd backend
dir .env

# If not, create it:
notepad .env

# Add:
GITHUB_TOKEN=ghp_your_token_here

# Restart backend:
npm start
```

### Error: "Invalid GitHub token"

**Solution:**
- Token might be expired
- Generate new token
- Make sure `repo` scope is checked
- Update `.env` file
- Restart backend

### Error: "Repository not found"

**Solution:**
- Repository will be created automatically
- Make sure username is correct
- Check token has `repo` permission

### Sync Not Happening

**Check:**
1. Backend running? (`npm start` in backend folder)
2. GitHub connected? (Green button in editor)
3. Auto-sync enabled? (Check settings)
4. All tests passed? (Must be "Accepted")
5. Console errors? (F12 → Console tab)

## Backend Logs

Watch backend console for:

```
✅ GitHub integration routes mounted
POST /api/github/sync-solution
✅ Solution synced successfully
```

Or errors:
```
❌ GitHub token not configured
❌ Invalid GitHub token
❌ API rate limit exceeded
```

## Testing Without Solving

Quick test in browser console:

```javascript
// Open Console (F12) on playground page
// Make sure you're connected to GitHub first

const testSync = async () => {
  const response = await fetch('http://localhost:3001/api/github/sync-solution', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'YOUR_GITHUB_USERNAME',
      fileName: 'test.js',
      folderPath: 'Easy/Array',
      content: '// Test file\nconsole.log("Hello GitHub!");',
      problemTitle: 'Test Problem',
      difficulty: 'Easy',
      category: 'Array',
      language: 'javascript'
    })
  });
  
  const data = await response.json();
  console.log('Response:', data);
  
  if (data.success) {
    console.log('✅ GitHub sync works!');
    console.log('File URL:', data.fileUrl);
  } else {
    console.log('❌ Error:', data.error);
  }
};

testSync();
```

## Complete Setup Checklist

- [ ] GitHub token generated
- [ ] Token has `repo` scope
- [ ] Token added to `backend/.env`
- [ ] Backend restarted
- [ ] Backend shows "GitHub integration routes mounted"
- [ ] Frontend connected (entered username)
- [ ] Green "Connected" button visible
- [ ] Auto-sync enabled in settings
- [ ] Test submission successful
- [ ] Notification appeared
- [ ] Repository created on GitHub
- [ ] Solution file visible

## What Happens Automatically

1. **On First Sync:**
   - Creates `leetcode-solutions` repository
   - Sets description: "My LeetCode solutions - Auto-synced from CP-AI"
   - Makes it public (you can change to private later)
   - Initializes with README

2. **On Each Sync:**
   - Creates folder structure (Difficulty/Category)
   - Generates filename: `{id}-{title}.{ext}`
   - Adds problem description and stats
   - Commits with message: "Add: {Problem Title} ({Language})"
   - Updates if file already exists

3. **Notifications:**
   - Shows sync status (syncing/success/error)
   - Provides GitHub link on success
   - Auto-dismisses after 5 seconds

## Security Notes

- ✅ Token stored in backend `.env` (not in frontend)
- ✅ `.env` in `.gitignore` (won't be committed)
- ✅ Only your username stored in frontend
- ✅ All API calls go through your backend
- ⚠️ Keep token secret
- ⚠️ Don't share `.env` file
- ⚠️ Rotate token periodically

## Rate Limits

GitHub API limits:
- **Authenticated:** 5,000 requests/hour
- **Per repository:** No specific limit
- **File size:** 100 MB max

You're unlikely to hit these limits with normal use.

## Next Steps

Once working:
1. Solve problems
2. Submit solutions
3. Watch them sync automatically
4. Build your portfolio!

Your GitHub profile will show:
- Green contribution squares
- Growing repository
- Organized solutions
- Professional portfolio

## Support

If still not working:
1. Check backend console for errors
2. Check browser console (F12)
3. Verify token permissions
4. Try test script above
5. Check GitHub token hasn't expired

The automatic sync is fully implemented and ready to use! Just follow the setup steps above.
