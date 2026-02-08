# Send Emails to Your Inbox - Quick Guide 📬

## What Changed

✅ **Nodemailer integrated** - Sends real emails to Gmail/Outlook/Yahoo
✅ **Email notifications work** - Friend requests, acceptances, new messages
✅ **Professional HTML emails** - Beautiful templates with buttons

## Setup (3 Steps)

### 1. Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/apppasswords
2. Create App Password for "Mail"
3. Copy the 16-character code (remove spaces)

### 2. Update backend/.env

```env
SMTP_USER=adityabakshi1011@gmail.com
SMTP_PASS=your_app_password_here
```

**Replace `your_app_password_here` with your actual App Password!**

### 3. Restart Backend

```bash
cd backend
npm start
```

Look for:
```
✅ Email service configured - emails will be sent to inbox
```

## Test It

1. Open app: http://localhost:5173
2. Go to LeetCode → Chat with Friends
3. Send friend request to any email
4. **Check your inbox!** 📧

## What You'll Receive

### Friend Request Email
- Subject: "New Friend Request from [Name]"
- Beautiful HTML design
- "View Request" button
- Sender's email shown

### Friend Accepted Email
- Subject: "[Name] accepted your friend request!"
- Green celebration theme
- "Start Chatting" button

### New Message Email
- Subject: "New message from [Name] about [Problem]"
- Message preview
- "Reply Now" button

## Troubleshooting

### Not receiving emails?

1. **Check backend console** - Should show: "✅ Email sent successfully"
2. **Check spam folder** - Gmail might filter it initially
3. **Verify App Password** - Remove all spaces from the password
4. **Enable 2-Step Verification** - Required for App Passwords

### "Authentication failed"?

- Use **App Password**, not your regular Gmail password
- Get it from: https://myaccount.google.com/apppasswords

## Files Modified

- ✅ `backend/utils/email-notifications.js` - Added Nodemailer
- ✅ `backend/.env` - Added SMTP credentials
- ✅ `GMAIL_EMAIL_SETUP.md` - Detailed setup guide

## Current Status

**Before**: Emails logged to console only
**After**: Real emails sent to inbox! 📧

---

**Next**: Add your Gmail App Password to `backend/.env` and restart!
