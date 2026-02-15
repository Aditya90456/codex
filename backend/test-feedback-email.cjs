// Quick test script for feedback email system
require('dotenv').config({ path: './.env' });

console.log('\n🧪 Testing Feedback Email Configuration\n');
console.log('=' .repeat(50));

// Check environment variables
console.log('\n📧 Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('FEEDBACK_EMAIL:', process.env.FEEDBACK_EMAIL ? '✅ Set' : '❌ Missing');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.log('\n❌ ERROR: Email credentials missing!');
  console.log('\nAdd these to backend/.env:');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_PASSWORD=your-app-password');
  console.log('FEEDBACK_EMAIL=your-email@gmail.com');
  process.exit(1);
}

console.log('\n✅ All environment variables are set!');

// Test nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log('\n🔄 Testing email connection...\n');

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email connection failed!');
    console.log('\nError:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n⚠️  You need a Gmail App Password!');
      console.log('\n📝 Quick Setup:');
      console.log('1. Go to: https://myaccount.google.com/security');
      console.log('2. Enable 2-Step Verification');
      console.log('3. Go to: https://myaccount.google.com/apppasswords');
      console.log('4. Generate app password for "Mail"');
      console.log('5. Update EMAIL_PASSWORD in backend/.env');
      console.log('6. Restart backend server');
    } else if (error.message.includes('Missing credentials')) {
      console.log('\n⚠️  Email credentials not loaded!');
      console.log('\nMake sure backend/.env has:');
      console.log('EMAIL_USER=your-email@gmail.com');
      console.log('EMAIL_PASSWORD=your-app-password');
    }
  } else {
    console.log('✅ Email connection successful!');
    console.log('\n🎉 Your feedback system is ready to use!');
    console.log('\nTest it:');
    console.log('1. Go to Playground Sheet');
    console.log('2. Click "Feedback" button');
    console.log('3. Submit feedback');
    console.log('4. Check your email inbox!');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});
