const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Save feedback to file (backup system)
async function saveFeedbackToFile(feedbackData) {
  try {
    const dataDir = path.join(__dirname, '../data');
    const feedbackFile = path.join(dataDir, 'feedback.json');

    // Create data directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing feedback
    let feedbacks = [];
    try {
      const data = await fs.readFile(feedbackFile, 'utf8');
      feedbacks = JSON.parse(data);
    } catch {
      // File doesn't exist yet, start with empty array
      feedbacks = [];
    }

    // Add new feedback with timestamp
    feedbacks.push({
      ...feedbackData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });

    // Save back to file
    await fs.writeFile(feedbackFile, JSON.stringify(feedbacks, null, 2));
    console.log('✅ Feedback saved to file:', feedbackFile);
    
    return true;
  } catch (error) {
    console.error('❌ Error saving feedback to file:', error);
    return false;
  }
}

// Submit feedback endpoint
router.post('/submit', async (req, res) => {
  try {
    const { rating, category, message, userEmail, userName } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Feedback message is required'
      });
    }

    // Save feedback to file first (backup)
    await saveFeedbackToFile({
      rating,
      category,
      message,
      userEmail,
      userName
    });

    // Try to send emails
    let emailSent = false;
    let emailError = null;

    try {
      // Email to admin (you)
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.FEEDBACK_EMAIL || process.env.EMAIL_USER,
        subject: `🎯 Playground Sheet Feedback - ${category}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Feedback Received</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>User:</strong> ${userName || 'Anonymous'}</p>
              <p><strong>Email:</strong> ${userEmail || 'Not provided'}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <h3 style="margin-top: 0;">Feedback Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 12px;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
        `
      };

      // Email to user (confirmation)
      const userMailOptions = userEmail ? {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: '✨ Thank you for your feedback! - Playground Sheet',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px;">
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">✨</span>
                </div>
                <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Thank You, ${userName?.split(' ')[0] || 'Friend'}!</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0;">We received your feedback</p>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #374151; margin: 0 0 10px 0;"><strong>Your Rating:</strong> ${'⭐'.repeat(rating)}</p>
                <p style="color: #374151; margin: 0 0 10px 0;"><strong>Category:</strong> ${category}</p>
                <p style="color: #374151; margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
                <p style="color: #1e40af; margin: 0; font-weight: 600;">Your Feedback:</p>
                <p style="color: #1f2937; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 20px 0;">
                  We appreciate you taking the time to help us improve Playground Sheet. 
                  Your feedback helps us build better features for everyone! 🚀
                </p>
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/playground" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
                  Back to Playground Sheet
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This is an automated confirmation email. Please do not reply to this message.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: white; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Playground Sheet. All rights reserved.
              </p>
            </div>
          </div>
        `
      } : null;

      // Send email to admin
      await transporter.sendMail(adminMailOptions);

      // Send confirmation email to user if email provided
      if (userMailOptions) {
        await transporter.sendMail(userMailOptions);
      }

      emailSent = true;
      console.log('✅ Emails sent successfully');

    } catch (emailErr) {
      emailError = emailErr.message;
      console.error('⚠️ Email sending failed:', emailErr.message);
      console.log('📝 Feedback saved to file as backup');
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      emailSent: emailSent,
      savedToFile: true,
      note: emailSent ? 'Emails sent and saved to file' : 'Saved to file (email configuration needed)'
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      details: error.message
    });
  }
});

module.exports = router;
