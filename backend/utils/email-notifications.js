const { Clerk } = require('@clerk/clerk-sdk-node');
const nodemailer = require('nodemailer');

// Initialize Clerk with your secret key (optional - will gracefully fail if not set)
let clerk = null;
try {
  if (process.env.CLERK_SECRET_KEY) {
    clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
  } else {
    console.log('⚠️  CLERK_SECRET_KEY not set - email notifications will be logged only');
  }
} catch (error) {
  console.log('⚠️  Clerk initialization failed - email notifications will be logged only');
}

// Initialize Nodemailer transporter
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('✅ Email service configured - emails will be sent to inbox');
} else {
  console.log('⚠️  SMTP credentials not set - emails will be logged only');
  console.log('   Add SMTP_USER and SMTP_PASS to .env to enable email sending');
}

/**
 * Send email notification
 * @param {string} emailOrUserId - Email address or user ID
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 */
async function sendEmailNotification(emailOrUserId, subject, htmlContent) {
  try {
    let email = emailOrUserId;

    // Check if it's an email address (contains @)
    const isEmail = emailOrUserId.includes('@');

    if (!isEmail && clerk) {
      // It's a user ID, try to get email from Clerk
      try {
        const user = await clerk.users.getUser(emailOrUserId);
        if (user && user.emailAddresses && user.emailAddresses.length > 0) {
          const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
          email = primaryEmail?.emailAddress || user.emailAddresses[0].emailAddress;
        }
      } catch (clerkError) {
        console.log(`Could not fetch user from Clerk: ${clerkError.message}`);
      }
    }

    // Log the notification
    console.log('📧 Email Notification:');
    console.log('   To:', email);
    console.log('   Subject:', subject);

    // Send actual email if transporter is configured
    if (transporter && email) {
      try {
        await transporter.sendMail({
          from: `"${process.env.APP_NAME || 'Coding Platform'}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: subject,
          html: htmlContent
        });
        console.log('   ✅ Email sent successfully to inbox!');
      } catch (emailError) {
        console.error('   ❌ Failed to send email:', emailError.message);
        console.log('   Note: Email logged but not sent');
      }
    } else {
      console.log('   Note: Set SMTP_USER and SMTP_PASS in .env to send actual emails');
    }

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error.message);
    return true; // Return true so chat system continues working even if email fails
  }
}

/**
 * Send friend request notification
 * @param {string} toUserEmail - Recipient's email address
 * @param {string} fromUserName - Sender's name
 * @param {string} fromUserEmail - Sender's email address
 */
async function sendFriendRequestNotification(toUserEmail, fromUserName, fromUserEmail) {
  const subject = `New Friend Request from ${fromUserName}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 New Friend Request!</h1>
        </div>
        <div class="content">
          <p>Hi there!</p>
          <p><strong>${fromUserName}</strong> (${fromUserEmail}) wants to connect with you on the coding platform.</p>
          <p>Accept their friend request to start chatting about problems and sharing solutions!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/leetcode" class="button">View Request</a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Once you're friends, you can chat about specific problems and share code snippets!
          </p>
        </div>
        <div class="footer">
          <p>This is an automated notification from your coding platform.</p>
          <p>You can manage your notification preferences in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailNotification(toUserEmail, subject, htmlContent);
}

/**
 * Send new message notification
 * @param {string} toUserEmail - Recipient's email address
 * @param {string} fromUserName - Sender's name
 * @param {string} problemTitle - Problem title
 * @param {string} messagePreview - Message preview text
 */
async function sendNewMessageNotification(toUserEmail, fromUserName, problemTitle, messagePreview) {
  const subject = `New message from ${fromUserName} about ${problemTitle}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Message!</h1>
        </div>
        <div class="content">
          <p>Hi there!</p>
          <p><strong>${fromUserName}</strong> sent you a message about <strong>${problemTitle}</strong>:</p>
          <div class="message-box">
            <p style="margin: 0; color: #555;">${messagePreview}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/leetcode" class="button">Reply Now</a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Continue the conversation and collaborate on solving this problem together!
          </p>
        </div>
        <div class="footer">
          <p>This is an automated notification from your coding platform.</p>
          <p>You can manage your notification preferences in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailNotification(toUserEmail, subject, htmlContent);
}

/**
 * Send friend request accepted notification
 * @param {string} toUserEmail - Recipient's email address
 * @param {string} acceptedByName - Name of person who accepted
 */
async function sendFriendRequestAcceptedNotification(toUserEmail, acceptedByName) {
  const subject = `${acceptedByName} accepted your friend request!`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Friend Request Accepted!</h1>
        </div>
        <div class="content">
          <p>Great news!</p>
          <p><strong>${acceptedByName}</strong> accepted your friend request!</p>
          <p>You can now chat with them about coding problems and share solutions.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/leetcode" class="button">Start Chatting</a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Head to any problem page and click the "Chat with Friends" tab to start a conversation!
          </p>
        </div>
        <div class="footer">
          <p>This is an automated notification from your coding platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailNotification(toUserEmail, subject, htmlContent);
}

module.exports = {
  sendEmailNotification,
  sendFriendRequestNotification,
  sendNewMessageNotification,
  sendFriendRequestAcceptedNotification
};
