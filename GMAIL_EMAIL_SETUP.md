# Gmail Email Setup - Send Emails to Inbox 📧

## Quick Setup (5 Minutes)

### Step 1: Get Gmail App Password

1. **Go to Google Account Settings**:
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

3. **Create App Password**:
   - Go back to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "Coding Platform"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update:

```env
# Email Configuration
SMTP_USER=adityabakshi1011@gmail.com
SMTP_PASS=abcd efgh ijkl mnop    # Paste your App Password here (remove spaces)
APP_NAME=Coding Platform
APP_URL=http://localhost:5173
```

**Important**: Remove spaces from the App Password!
- ❌ Wrong: `abcd efgh ijkl mnop`
- ✅ Correct: `abcdefghijklmnop`

### Step 3: Restart Backend

```bash
cd backend
npm start
```

You should see:
```
✅ Email service configured - emails will be sent to inbox
```

### Step 4: Test It!

1. Go to your app: http://localhost:5173
2. Navigate to LeetCode → Chat with Friends
3. Send a friend request to another email
4. **Check your inbox** - you should receive the email!

## Email Types You'll Receive

### 1. Friend Request
```
Subject: New Friend Request from [Name]
Content: Beautiful HTML email with "View Request" button
```

### 2. Friend Request Accepted
```
Subject: [Name] accepted your friend request!
Content: Celebration email with "Start Chatting" button
```

### 3. New Message
```
Subject: New message from [Name] about [Problem]
Content: Message preview with "Reply Now" button
```

## Troubleshooting

### "Invalid login" or "Authentication failed"

**Cause**: Wrong password or App Password not created

**Fix**:
1. Make sure you created an **App Password** (not your regular Gmail password)
2. Remove all spaces from the App Password
3. Enable 2-Step Verification first

### "Less secure app access"

**Cause**: Google blocked the login

**Fix**:
- Use App Password instead (recommended)
- Or enable "Less secure app access" (not recommended)

### Emails not arriving

**Check**:
1. ✅ Backend console shows: "✅ Email sent successfully to inbox!"
2. ✅ Check spam/junk folder
3. ✅ Verify email address is correct
4. ✅ SMTP_USER and SMTP_PASS are set correctly

### "SMTP connection failed"

**Fix**:
1. Check internet connection
2. Verify Gmail credentials
3. Make sure 2-Step Verification is enabled
4. Regenerate App Password

## Alternative Email Services

### Outlook/Hotmail
```env
SMTP_USER=your-email@outlook.com
SMTP_PASS=your_password
```
Change in `email-notifications.js`:
```javascript
service: 'outlook'  // instead of 'gmail'
```

### Yahoo Mail
```env
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your_app_password
```
Change in `email-notifications.js`:
```javascript
service: 'yahoo'  // instead of 'gmail'
```

### Custom SMTP Server
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your_password
```

Update `email-notifications.js`:
```javascript
transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

## Security Notes

### App Password vs Regular Password

✅ **Use App Password** (Recommended):
- More secure
- Can be revoked without changing main password
- Required if 2-Step Verification is enabled

❌ **Don't use regular password**:
- Less secure
- Requires "Less secure app access"
- Not recommended by Google

### Keep Credentials Safe

- ✅ Never commit `.env` file to Git
- ✅ Use environment variables in production
- ✅ Revoke App Passwords you're not using
- ✅ Use different App Passwords for different apps

## Testing

### Test Email Sending

```bash
node test-email-chat.cjs
```

Expected console output:
```
📧 Email Notification:
   To: alice@example.com
   Subject: New Friend Request from John Doe
   ✅ Email sent successfully to inbox!
```

### Check Your Inbox

You should receive:
- Professional HTML email
- Proper formatting
- Working buttons
- No spam warnings

## Production Setup

For production, use environment variables:

### Vercel
```bash
vercel env add SMTP_USER
vercel env add SMTP_PASS
```

### Heroku
```bash
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your_app_password
```

### Docker
```yaml
environment:
  - SMTP_USER=your-email@gmail.com
  - SMTP_PASS=your_app_password
```

## Rate Limits

### Gmail Free Account
- **500 emails per day**
- **100 recipients per email**
- Sufficient for most applications

### If You Need More
Consider professional email services:
- SendGrid (100 emails/day free)
- Mailgun (100 emails/day free)
- AWS SES (62,000 emails/month free)

## Summary

1. ✅ Get Gmail App Password
2. ✅ Add to `backend/.env`
3. ✅ Restart backend
4. ✅ Test by sending friend request
5. ✅ Check your inbox!

**Status**: Ready to send emails to inbox!
**Time**: 5 minutes setup
**Cost**: Free (Gmail)

---

**Need help?** Check the backend console for detailed error messages.
