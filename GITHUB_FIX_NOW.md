# GitHub Integration Fix - Complete Guide 🔧

## The Problem

Error: `Resource not accessible by personal access token`

This means your GitHub token doesn't have the `repo` scope needed to create repositories.

## Quick Fix (5 Minutes)

### Step 1: Generate New GitHub Token

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Click "Generate new token (classic)"**

3. **Configure Token**:
   - **Note**: `CP-AI LeetCode Sync`
   - **Expiration**: 90 days (or No expiration)
   - **Select scopes**:
     - ✅ **repo** (Full control of private repositories) - THIS IS REQUIRED!
       - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
     - ✅ **workflow** (optional, for GitHub Actions)

4. **Generate token**
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately! You won't see it again!
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Update Backend .env File

Open `backend/.env` and update the GITHUB_TOKEN:

```env
GITHUB_TOKEN=ghp_YOUR_NEW_TOKEN_HERE
```

Replace `ghp_YOUR_NEW_TOKEN_HERE` with the token you just copied.

### Step 3: Restart Backend Server

```bash
# Stop the current backend server (Ctrl+C)
# Then restart:
cd backend
npm start
```

Or if using the batch file:
```bash
start-backend.bat
```

### Step 4: Test It

Run the test script:
```bash
node test-github-integration.js
```

Or test from the UI:
1. Go to LeetCode Editor
2. Solve a problem
3. Click "Sync to GitHub" button
4. Should see success message!

## Alternative: Fine-Grained Token (More Secure)

If you want better security, use a fine-grained token:

1. **Go to**: https://github.com/settings/tokens?type=beta
2. **Click**: "Generate new token"
3. **Configure**:
   - **Token name**: `CP-AI LeetCode Sync`
   - **Expiration**: 90 days
   - **Repository access**: All repositories (or select specific ones)
   - **Permissions**:
     - Contents: **Read and write** ✅
     - Metadata: **Read-only** ✅
     - Administration: **Read and write** ✅ (needed to create repos)
4. **Generate** and copy token
5. Update `backend/.env` with new token
6. Restart backend

## Verify Token Permissions

You can verify your token has the right permissions:

```bash
# Test with curl (replace YOUR_TOKEN)
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

Should return your GitHub user info without errors.

## Common Issues

### Issue 1: Token Still Not Working
**Solution**: Make sure you selected the `repo` scope (not just `public_repo`)

### Issue 2: "Bad credentials" Error
**Solution**: Token might be expired or incorrect. Generate a new one.

### Issue 3: Rate Limit Exceeded
**Solution**: Wait an hour or use a different token. GitHub has rate limits.

### Issue 4: Repository Already Exists
**Solution**: That's fine! The code will update existing files.

## What Happens When You Sync?

1. **First Time**:
   - Creates repository: `leetcode-solutions`
   - Initializes with README
   - Commits your solution

2. **Subsequent Times**:
   - Updates existing file if it exists
   - Creates new file if it doesn't exist
   - Commits with descriptive message

## Repository Structure

Your GitHub repo will look like:
```
leetcode-solutions/
├── README.md
├── Arrays/
│   ├── TwoSum.js
│   ├── BestTimeToBuyStock.py
│   └── ...
├── Strings/
│   ├── ValidAnagram.cpp
│   └── ...
└── Trees/
    ├── InvertBinaryTree.java
    └── ...
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit your `.env` file to GitHub
- Keep your token secret
- Use fine-grained tokens when possible
- Set expiration dates on tokens
- Revoke tokens you're not using

## Test Script

Create `test-github-token.js`:

```javascript
const { Octokit } = require('@octokit/rest');
require('dotenv').config({ path: './backend/.env' });

async function testToken() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ No GITHUB_TOKEN found in .env');
    return;
  }
  
  console.log('🔍 Testing GitHub token...');
  console.log('Token:', token.substring(0, 10) + '...');
  
  const octokit = new Octokit({ auth: token });
  
  try {
    // Test authentication
    const { data: user } = await octokit.users.getAuthenticated();
    console.log('✅ Authenticated as:', user.login);
    console.log('📧 Email:', user.email);
    
    // Test repo creation permission
    console.log('\n🔍 Checking permissions...');
    const { headers } = await octokit.request('GET /user/repos', {
      per_page: 1
    });
    
    console.log('✅ Token has repo access!');
    console.log('Rate limit remaining:', headers['x-ratelimit-remaining']);
    
    console.log('\n✅ Token is valid and ready to use!');
    
  } catch (error) {
    console.error('❌ Token test failed:', error.message);
    if (error.status === 401) {
      console.error('Token is invalid or expired. Generate a new one.');
    } else if (error.status === 403) {
      console.error('Token lacks required permissions. Make sure "repo" scope is selected.');
    }
  }
}

testToken();
```

Run it:
```bash
node test-github-token.js
```

## Success Indicators

When working correctly, you'll see:
- ✅ Authenticated as: [your-username]
- ✅ Repository created (first time)
- ✅ File synced successfully
- 🔗 GitHub URL to your solution

## Need Help?

If still having issues:
1. Check token has `repo` scope
2. Verify token is not expired
3. Make sure backend server restarted
4. Check backend console for detailed errors
5. Try the test script above

---

**Status**: Ready to fix! Follow steps above. ⬆️
