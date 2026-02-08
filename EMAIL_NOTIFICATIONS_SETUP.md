# Email Notifications Setup Guide (Optional)

## Current Status
✅ **Chat system is fully functional without email notifications**
- Notifications are logged to console
- System works perfectly for all chat features
- Email setup is completely optional

## Why Enable Email Notifications?

Email notifications enhance user engagement by:
- Alerting users about friend requests even when offline
- Notifying about new messages in real-time
- Improving response rates and collaboration
- Professional user experience

## Setup Options

### Option 1: Quick Setup (Console Logging Only) ✅ CURRENT
**Status**: Already working!
- No configuration needed
- Notifications logged to backend console
- Perfect for development and testing
- Zero cost

### Option 2: Enable Clerk Integration (Recommended)
**Time**: 5 minutes
**Cost**: Free tier available

1. **Get Clerk Secret Key**:
   ```
   1. Go to https://dashboard.clerk.com
   2. Sign up or log in
   3. Create/select your application
   4. Navigate to "API Keys" section
   5. Copy the "Secret Key" (starts with sk_test_ or sk_live_)
   ```

2. **Add to Environment**:
   ```bash
   # Add to backend/.env
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   ```

3. **Restart Backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Verify**:
   - You should see: "✅ Clerk initialized successfully"
   - Instead of: "⚠️ CLERK_SECRET_KEY not set"

**Note**: Clerk provides user management but doesn't send emails directly. You still need an email service (see Option 3).

### Option 3: Add Email Service (Production Ready)
**Time**: 15-30 minutes
**Cost**: Most have free tiers

Choose one email service:

#### A. SendGrid (Recommended)
**Free Tier**: 100 emails/day

1. **Sign up**: https://sendgrid.com
2. **Get API Key**: Settings → API Keys → Create API Key
3. **Install package**:
   ```bash
   cd backend
   npm install @sendgrid/mail
   ```

4. **Add to .env**:
   ```env
   SENDGRID_API_KEY=SG.your_api_key_here
   ```

5. **Update email-notifications.js**:
   ```javascript
   // Uncomment and configure in sendEmailNotification function
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   await sgMail.send({
     to: email,
     from: 'noreply@yourdomain.com', // Must be verified in SendGrid
     subject: subject,
     html: htmlContent
   });
   ```

#### B. Resend (Modern Alternative)
**Free Tier**: 100 emails/day

1. **Sign up**: https://resend.com
2. **Get API Key**: API Keys → Create
3. **Install package**:
   ```bash
   cd backend
   npm install resend
   ```

4. **Add to .env**:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

5. **Update email-notifications.js**:
   ```javascript
   const { Resend } = require('resend');
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'noreply@yourdomain.com',
     to: email,
     subject: subject,
     html: htmlContent
   });
   ```

#### C. Nodemailer (SMTP - Any Provider)
**Cost**: Depends on provider (Gmail, Outlook, etc.)

1. **Install package**:
   ```bash
   cd backend
   npm install nodemailer
   ```

2. **Add to .env**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Update email-notifications.js**:
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS
     }
   });
   
   await transporter.sendMail({
     from: process.env.SMTP_USER,
     to: email,
     subject: subject,
     html: htmlContent
   });
   ```

## Complete Setup Example (SendGrid)

### Step-by-Step

1. **Install SendGrid**:
   ```bash
   cd backend
   npm install @sendgrid/mail
   ```

2. **Update backend/.env**:
   ```env
   CLERK_SECRET_KEY=sk_test_your_clerk_key
   SENDGRID_API_KEY=SG.your_sendgrid_key
   APP_URL=http://localhost:5173
   ```

3. **Update backend/utils/email-notifications.js**:
   
   Find this section (around line 40):
   ```javascript
   // TODO: Integrate with actual email service
   // Example with SendGrid:
   // const sgMail = require('@sendgrid/mail');
   // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   // await sgMail.send({
   //   to: email,
   //   from: 'noreply@yourapp.com',
   //   subject: subject,
   //   html: htmlContent
   // });
   ```

   Replace with:
   ```javascript
   // Send email with SendGrid
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   await sgMail.send({
     to: email,
     from: 'noreply@yourdomain.com', // Verify this in SendGrid
     subject: subject,
     html: htmlContent
   });
   ```

4. **Verify sender email in SendGrid**:
   - Go to SendGrid Dashboard
   - Settings → Sender Authentication
   - Verify your domain or single sender email

5. **Restart backend**:
   ```bash
   npm start
   ```

6. **Test**:
   ```bash
   node test-problem-chat.cjs
   ```

## Testing Email Notifications

### Test Friend Request Email
```bash
curl -X POST http://localhost:3001/api/problem-chat/friends/request \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": "user_test123",
    "toUserId": "user_test456",
    "fromUserName": "John Doe"
  }'
```

### Test Message Email
```bash
curl -X POST http://localhost:3001/api/problem-chat/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room123",
    "userId": "user_test123",
    "userName": "John Doe",
    "message": "Test message"
  }'
```

## Troubleshooting

### "CLERK_SECRET_KEY not set" warning
- **Expected**: This is normal if you haven't added the key
- **Impact**: None - system works perfectly
- **Fix**: Add key to backend/.env if you want Clerk integration

### Emails not sending
1. **Check API key**: Verify it's correct in .env
2. **Check sender email**: Must be verified in email service
3. **Check logs**: Backend console shows detailed errors
4. **Check rate limits**: Free tiers have daily limits
5. **Check spam folder**: Emails might be filtered

### "User not found" error
- **Cause**: Clerk can't find the user ID
- **Fix**: Ensure user IDs match Clerk user IDs
- **Alternative**: Use email addresses directly instead of Clerk

## Cost Comparison

| Service | Free Tier | Paid Plans | Best For |
|---------|-----------|------------|----------|
| **SendGrid** | 100/day | $15/mo (40k) | Most popular |
| **Resend** | 100/day | $20/mo (50k) | Modern API |
| **Mailgun** | 100/day | $35/mo (50k) | Developers |
| **AWS SES** | 62k/mo | $0.10/1k | High volume |
| **Gmail SMTP** | 500/day | Free | Testing only |

## Recommendations

### For Development
✅ **Current setup** (console logging) - Perfect!

### For Small Projects
✅ **Clerk + SendGrid** - Easy setup, reliable

### For Production
✅ **Clerk + Resend** - Modern, great DX
✅ **AWS SES** - Scalable, cost-effective

### For Enterprise
✅ **Custom SMTP + Monitoring** - Full control

## Summary

Your chat system is **fully functional** right now! Email notifications are a nice-to-have feature that can be added anytime. The system gracefully handles missing email configuration and continues working perfectly.

**Current Status**: ✅ Working (console logging)
**Recommended Next Step**: Keep as-is for development, add SendGrid for production
**Time to Enable**: 5-30 minutes depending on option chosen

---

**Need help?** Check the logs in the backend console for detailed information about notification attempts.
