# Feedback Email Setup Guide

## Overview
The feedback system sends user feedback directly to your email using Nodemailer.

## Setup Steps

### 1. Install Nodemailer (if not already installed)
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email Settings

Add these variables to your `backend/.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FEEDBACK_EMAIL=your-email@gmail.com
```

### 3. Gmail App Password Setup

If using Gmail:

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification
4. Go to "App passwords"
5. Generate a new app password for "Mail"
6. Copy the 16-character password
7. Use this password in `EMAIL_PASSWORD`

### 4. Alternative Email Services

For other email services, update the transporter configuration in `backend/routes/feedback.js`:

**Outlook/Hotmail:**
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**Custom SMTP:**
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Features

The feedback system includes:

- ⭐ 5-star rating system
- 📋 Category selection (General, Bug Report, Feature Request, UI/UX, Performance)
- 💬 Detailed message input
- 👤 Automatic user info capture (name, email from Clerk)
- 📧 Professional HTML email format
- ✅ Success/error handling

## Email Format

Feedback emails include:
- User rating (stars)
- Feedback category
- User name and email
- Detailed message
- Timestamp

## Testing

1. Start the backend server:
```bash
cd backend
node server.js
```

2. Open the Playground Sheet
3. Click the "Feedback" button
4. Fill out the form
5. Submit
6. Check your email inbox

## Troubleshooting

**Email not sending:**
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Verify Gmail app password is enabled
- Check backend console for errors
- Ensure port 587/465 is not blocked

**"Less secure app" error:**
- Use App Password instead of regular password
- Enable 2-Step Verification first

## Security Notes

- Never commit `.env` file to Git
- Use environment variables for production
- Keep app passwords secure
- Regularly rotate passwords

## Production Deployment

For production (Vercel, Heroku, etc.):

1. Add environment variables in your hosting platform
2. Use secure email service (SendGrid, AWS SES, etc.)
3. Implement rate limiting
4. Add spam protection

## Support

If you encounter issues:
1. Check backend console logs
2. Verify email credentials
3. Test with a simple nodemailer script
4. Check firewall/network settings
