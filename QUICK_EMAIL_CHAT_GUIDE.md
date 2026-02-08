# Quick Guide: Email-Based Chat

## What Changed?

### Before ❌
```
Input: "Enter friend's user ID"
Example: user_2abc123xyz
```

### After ✅
```
Input: "Enter friend's email address"
Example: friend@example.com
```

## How to Use (3 Steps)

### 1. Restart Backend
```bash
cd backend
npm start
```

### 2. Add Friend by Email
1. Go to LeetCode → Chat with Friends
2. Type: `friend@example.com`
3. Click "Send Request"

### 3. Friend Accepts
- They see your name and email
- Click "Accept"
- Start chatting!

## What You'll See

### Friend Request
```
┌─────────────────────────────┐
│ John Doe                    │
│ john@example.com            │
│         [Accept] [Reject]   │
└─────────────────────────────┘
```

### Friends List
```
┌─────────────────────────────┐
│ Alice Smith                 │
│ alice@example.com           │
└─────────────────────────────┘
│ Bob Johnson                 │
│ bob@example.com             │
└─────────────────────────────┘
```

## Test It

```bash
node test-email-chat.cjs
```

Expected: All tests pass ✅

## Benefits

✅ Easier to remember (email vs random ID)
✅ More user-friendly
✅ Works with email notifications
✅ Standard format everyone knows

---

**TL;DR**: Use emails instead of IDs. Restart backend. Done!
