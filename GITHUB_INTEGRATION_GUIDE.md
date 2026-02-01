# GitHub Integration for LeetCode Solutions 🚀

## Overview
Automatically sync your accepted LeetCode solutions to a GitHub repository, building your coding portfolio with every successful submission!

## Features ✨

### 1. **Automatic Sync**
- Solutions automatically pushed to GitHub when you submit and pass all test cases
- Organized folder structure by difficulty and category
- Includes problem description, stats, and metadata in each file

### 2. **Smart Organization**
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

### 3. **Rich Metadata**
Each synced file includes:
- Problem title, difficulty, and category
- Full problem description
- Submission results (runtime, memory, test cases)
- Timestamp and language used
- Your solution code

### 4. **User Control**
- Toggle auto-sync on/off
- Connect/disconnect GitHub anytime
- Manual sync option
- Real-time sync status notifications

## Setup Instructions 🛠️

### Step 1: Get GitHub Personal Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a descriptive name: "LeetCode Solutions Sync"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure Backend

1. Navigate to the `backend` folder
2. Create or update `.env` file:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   # or
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Step 3: Connect in Frontend

1. Open the LeetCode Playground (`/playground`)
2. Click the **Settings** icon (⚙️) in the editor toolbar
3. Scroll to "GitHub Integration" section
4. Click "Connect GitHub"
5. Enter your GitHub username
6. Click "Connect"

## Usage 📝

### Automatic Sync (Recommended)

1. **Enable Auto-Sync** (enabled by default after connecting)
2. Solve a problem in the editor
3. Click "Submit" button
4. If all test cases pass ✅
5. Solution automatically syncs to GitHub!
6. See success notification with GitHub link

### Manual Control

**Toggle Auto-Sync:**
- Open Settings panel
- Find "Auto-sync on submit" toggle
- Turn on/off as needed

**Disconnect GitHub:**
- Open Settings panel
- Click "Disconnect GitHub"
- Your solutions remain in the repo

## File Format 📄

Example synced file:

```javascript
/*
 * Problem: Two Sum
 * Difficulty: Easy
 * Category: Array
 * 
 * Description:
 * Given an array of integers nums and an integer target, 
 * return indices of the two numbers such that they add up to target.
 * 
 * Submission Result:
 * - Status: Accepted ✅
 * - Test Cases Passed: 57/57
 * - Runtime: 52 ms
 * - Memory: 42.1 MB
 * 
 * Submitted: 2024-01-15T10:30:00.000Z
 * Language: javascript
 */

function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
```

## API Endpoints 🔌

### Sync Solution
```http
POST /api/github/sync-solution
Content-Type: application/json

{
  "userId": "user123",
  "username": "github-username",
  "fileName": "1-two-sum.js",
  "folderPath": "Easy/Array",
  "content": "/* Problem: Two Sum */\n\nfunction twoSum...",
  "problemTitle": "Two Sum",
  "difficulty": "Easy",
  "category": "Array",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Solution synced to GitHub successfully",
  "fileUrl": "https://github.com/username/leetcode-solutions/blob/main/Easy/Array/1-two-sum.js",
  "commitSha": "abc123..."
}
```

### Get Repository Stats
```http
GET /api/github/repo-stats/:username
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSolutions": 42,
    "stars": 5,
    "lastUpdated": "2024-01-15T10:30:00.000Z",
    "repoUrl": "https://github.com/username/leetcode-solutions"
  }
}
```

## UI Components 🎨

### Settings Panel
- **Location:** Editor toolbar > Settings icon
- **Features:**
  - GitHub connection status
  - Username display
  - Auto-sync toggle
  - Disconnect button

### Connection Modal
- **Trigger:** Click "Connect GitHub"
- **Input:** GitHub username
- **Actions:** Connect or Cancel

### Sync Status Toast
- **Position:** Bottom-right corner
- **Types:**
  - 🔵 Info: "Syncing to GitHub..."
  - ✅ Success: "Synced to GitHub!" (with link)
  - ❌ Error: "GitHub sync failed: [reason]"
- **Duration:** Auto-dismisses after 5 seconds

## Supported Languages 💻

- JavaScript (`.js`)
- Python (`.py`)
- Java (`.java`)
- C++ (`.cpp`)
- TypeScript (`.ts`)

## Error Handling 🔧

### Common Issues

**1. "GitHub token not configured"**
- Solution: Add `GITHUB_TOKEN` to backend `.env` file
- Restart backend server

**2. "Invalid GitHub token"**
- Solution: Generate new token with correct scopes
- Update `.env` file

**3. "Repository not found"**
- Solution: Repository will be auto-created on first sync
- Ensure username is correct

**4. "API rate limit exceeded"**
- Solution: Wait an hour or use authenticated requests
- GitHub allows 5000 requests/hour for authenticated users

**5. "Insufficient permissions"**
- Solution: Ensure token has `repo` scope
- Regenerate token if needed

## Security 🔒

### Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Contains sensitive tokens

2. **Use environment variables**
   - Backend reads from `.env`
   - Frontend stores username only (no tokens)

3. **Token permissions**
   - Only grant necessary scopes
   - Use fine-grained tokens when possible

4. **Rotate tokens regularly**
   - Generate new tokens periodically
   - Revoke old tokens

## Backend Implementation 🏗️

### Files Added/Modified

1. **`backend/routes/github.js`** (NEW)
   - GitHub API integration
   - Repository creation/update
   - File sync logic
   - Stats endpoint

2. **`backend/server.js`** (MODIFIED)
   - Added GitHub routes
   - Mounted `/api/github` endpoint

3. **`backend/package.json`** (MODIFIED)
   - Added `@octokit/rest` dependency

4. **`backend/.env.example`** (MODIFIED)
   - Added GitHub token variables

### Dependencies

```json
{
  "@octokit/rest": "^20.0.2"
}
```

## Frontend Implementation 🎨

### Files Modified

1. **`src/components/LeetCodeEditor.jsx`**
   - Added GitHub state management
   - Sync functions
   - UI components (modal, toast, settings)
   - Auto-sync on successful submission

### New State Variables

```javascript
const [githubConnected, setGithubConnected] = useState(false);
const [githubUsername, setGithubUsername] = useState('');
const [autoSyncGithub, setAutoSyncGithub] = useState(true);
const [showGithubModal, setShowGithubModal] = useState(false);
const [isSyncingGithub, setIsSyncingGithub] = useState(false);
const [githubSyncStatus, setGithubSyncStatus] = useState(null);
```

### Key Functions

- `syncToGithub()` - Main sync function
- `generateGithubFileContent()` - Format solution file
- `connectGithub()` - Open connection modal
- `handleGithubConnect()` - Save username and connect

## Testing 🧪

### Manual Testing Steps

1. **Setup:**
   ```bash
   # Backend
   cd backend
   npm install
   npm start
   
   # Frontend
   npm run dev
   ```

2. **Connect GitHub:**
   - Open `/playground`
   - Click Settings
   - Connect GitHub with your username

3. **Test Sync:**
   - Select a problem
   - Write solution
   - Click Submit
   - Wait for all tests to pass
   - Check for success notification
   - Visit GitHub repo to verify

4. **Test Auto-Sync Toggle:**
   - Disable auto-sync
   - Submit solution
   - Verify no sync occurs
   - Enable auto-sync
   - Submit again
   - Verify sync works

5. **Test Disconnect:**
   - Click "Disconnect GitHub"
   - Verify settings cleared
   - Reconnect and test again

## Future Enhancements 🚀

### Planned Features

1. **OAuth Integration**
   - Replace username input with OAuth flow
   - More secure authentication
   - Better user experience

2. **Repository Customization**
   - Choose repository name
   - Select public/private
   - Custom folder structure

3. **Sync History**
   - View all synced solutions
   - Re-sync failed attempts
   - Sync statistics

4. **README Generation**
   - Auto-generate repo README
   - Problem count by category
   - Difficulty breakdown
   - Progress charts

5. **Multiple Languages**
   - Sync same problem in different languages
   - Language-specific folders
   - Comparison view

6. **Batch Operations**
   - Sync all past solutions
   - Bulk re-sync
   - Export to ZIP

## Troubleshooting 🔍

### Debug Mode

Enable detailed logging:

```javascript
// In LeetCodeEditor.jsx
console.log('GitHub sync starting:', {
  problem: selectedProblem.title,
  language,
  connected: githubConnected,
  autoSync: autoSyncGithub
});
```

### Check Backend Logs

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

Look for:
- ✅ GitHub integration routes mounted
- API request logs
- Error messages

### Verify GitHub Token

Test token manually:
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

## Support 💬

### Common Questions

**Q: Will this work with private repositories?**
A: Yes! The token has `repo` scope for both public and private repos.

**Q: Can I sync to an existing repository?**
A: Yes, but ensure the repo name is "leetcode-solutions" or modify the code.

**Q: What happens if I disconnect and reconnect?**
A: Your solutions remain in GitHub. New syncs will continue where you left off.

**Q: Can multiple users sync to the same repo?**
A: No, each user needs their own repository.

**Q: Does this work offline?**
A: No, GitHub sync requires internet connection.

## Contributing 🤝

Want to improve GitHub integration?

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License 📄

This feature is part of the CP-AI project and follows the same license.

---

**Happy Coding! 🎉**

Build your portfolio one solution at a time!
