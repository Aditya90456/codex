# GitHub Token Permission Fix

## Error
```
Resource not accessible by personal access token
x-accepted-github-permissions: administration=write
```

## Problem
Your GitHub Personal Access Token (PAT) doesn't have the required permissions to create repositories.

## Solution

### Step 1: Create New Token with Correct Permissions
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "CP-AI LeetCode Sync"
4. Select these scopes:
   - ✅ **repo** (Full control of private repositories)
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
     - security_events
   - ✅ **workflow** (Update GitHub Action workflows)
   - ✅ **write:packages** (Upload packages to GitHub Package Registry)
   - ✅ **delete:packages** (Delete packages from GitHub Package Registry)
5. Click "Generate token"
6. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Update Your .env File
```bash
# In backend/.env
GITHUB_TOKEN=ghp_YOUR_NEW_TOKEN_HERE
```

### Step 3: Restart Backend Server
```bash
node backend/server.js
```

## Why This Happened
The current token has limited permissions. GitHub requires the `repo` scope to create repositories.

## Test It
After updating the token, try the GitHub sync feature again. It should work!

## Alternative: Use Fine-Grained Token (Recommended)
1. Go to: https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Set permissions:
   - Repository access: All repositories
   - Permissions:
     - Contents: Read and write
     - Metadata: Read-only
     - Administration: Read and write
4. Generate and copy token
5. Update backend/.env

---
**Status**: Waiting for new token with correct permissions
