# Gmail App Password Setup - Quick Guide

## The Error You're Seeing
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means Gmail is blocking the login because you're using your regular password instead of an App Password.

## ✅ Quick Fix (5 minutes)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
   - OR: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Type "Playground Sheet" as the name
5. Click "Generate"
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File
Open `backend/.env` and add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
FEEDBACK_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Remove all spaces from the app password
- Use the app password, NOT your regular Gmail password

### Step 4: Restart Backend
```bash
cd backend
node server.js
```

## 🧪 Test It
1. Go to Playground Sheet
2. Click "Feedback" button
3. Fill out the form
4. Submit
5. Check your email inbox!

## ❌ Still Not Working?

### Option 1: Check Your Gmail Settings
- Make sure 2-Step Verification is ON
- Make sure you copied the app password correctly (no spaces)
- Try generating a new app password

### Option 2: Use Alternative Email Service

**Outlook/Hotmail:**
```javascript
// In backend/routes/feedback.js
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**SendGrid (Recommended for Production):**
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Option 3: Disable Email (Temporary)
The system will save feedback to a local file if email fails.
Check `backend/data/feedback.json` for submissions.

## 🔒 Security Tips
- Never commit `.env` file to Git
- Keep your app password secure
- Rotate passwords regularly
- Use environment variables in production

## 📧 Need Help?
If you're still stuck:
1. Check backend console for detailed errors
2. Verify EMAIL_USER matches your Gmail
3. Make sure no spaces in EMAIL_PASSWORD
4. Try with a different Gmail account

## ✨ Success!
Once working, you'll receive:
- Admin email with feedback details
- User gets beautiful confirmation email
- Feedback saved to database/file as backup
