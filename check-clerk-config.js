#!/usr/bin/env node

/**
 * Clerk Configuration Checker
 * Diagnoses Clerk setup issues
 */

console.log('🔍 Checking Clerk Configuration...\n');

// Check 1: Environment Variable
console.log('✓ Test 1: Checking VITE_CLERK_PUBLISHABLE_KEY...');
const clerkKey = process.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  console.log('  ❌ VITE_CLERK_PUBLISHABLE_KEY not found in environment');
  console.log('  💡 Add it to your .env file or Vercel dashboard');
} else if (clerkKey.includes('placeholder') || clerkKey.includes('your_')) {
  console.log('  ⚠️  Placeholder key detected');
  console.log('  💡 Replace with real key from dashboard.clerk.com');
} else if (!clerkKey.startsWith('pk_')) {
  console.log('  ❌ Invalid key format (should start with pk_test_ or pk_live_)');
} else if (clerkKey.length < 20) {
  console.log('  ❌ Key too short (likely incomplete)');
} else {
  console.log('  ✅ Key format looks valid');
  console.log(`  📝 Key: ${clerkKey.substring(0, 15)}...`);
}

// Check 2: .env file
console.log('\n✓ Test 2: Checking .env file...');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  const clerkLine = lines.find(line => line.includes('VITE_CLERK_PUBLISHABLE_KEY'));
  
  if (clerkLine) {
    console.log('  ✅ Found in .env file');
    const value = clerkLine.split('=')[1]?.trim();
    if (value && value.startsWith('pk_')) {
      console.log('  ✅ Value looks valid');
    } else {
      console.log('  ⚠️  Value might be invalid');
    }
  } else {
    console.log('  ⚠️  Not found in .env file');
  }
} else {
  console.log('  ⚠️  .env file not found');
}

// Check 3: Vercel Configuration
console.log('\n✓ Test 3: Checking vercel.json...');
const vercelPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  
  // Check rewrites
  const hasSignUpRewrite = vercelConfig.rewrites?.some(r => r.source === '/sign-up');
  const hasSignInRewrite = vercelConfig.rewrites?.some(r => r.source === '/sign-in');
  
  console.log(hasSignUpRewrite ? '  ✅ /sign-up route configured' : '  ❌ /sign-up route missing');
  console.log(hasSignInRewrite ? '  ✅ /sign-in route configured' : '  ❌ /sign-in route missing');
  
  // Check CSP headers
  const cspHeader = vercelConfig.headers?.[0]?.headers?.find(h => h.key === 'Content-Security-Policy');
  if (cspHeader) {
    const hasClerkDomain = cspHeader.value.includes('clerk.com');
    console.log(hasClerkDomain ? '  ✅ Clerk domains in CSP' : '  ⚠️  Clerk domains missing from CSP');
  }
} else {
  console.log('  ⚠️  vercel.json not found');
}

// Check 4: Sign-up page
console.log('\n✓ Test 4: Checking SignUpPage.jsx...');
const signUpPath = path.join(__dirname, 'src', 'pages', 'SignUpPage.jsx');
if (fs.existsSync(signUpPath)) {
  const content = fs.readFileSync(signUpPath, 'utf8');
  
  const hasSignUp = content.includes('SignUp');
  const hasErrorHandling = content.includes('clerkError');
  const hasLoadingState = content.includes('isClerkReady');
  
  console.log(hasSignUp ? '  ✅ SignUp component imported' : '  ❌ SignUp component missing');
  console.log(hasErrorHandling ? '  ✅ Error handling added' : '  ⚠️  No error handling');
  console.log(hasLoadingState ? '  ✅ Loading state added' : '  ⚠️  No loading state');
} else {
  console.log('  ❌ SignUpPage.jsx not found');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary');
console.log('='.repeat(50));

if (!clerkKey || clerkKey.includes('placeholder')) {
  console.log('\n❌ CRITICAL: Clerk key is not configured properly');
  console.log('\n📝 Next Steps:');
  console.log('1. Go to https://dashboard.clerk.com');
  console.log('2. Get your publishable key (starts with pk_test_)');
  console.log('3. Add to .env file: VITE_CLERK_PUBLISHABLE_KEY=your_key');
  console.log('4. Add to Vercel: Settings → Environment Variables');
  console.log('5. Redeploy your app');
} else {
  console.log('\n✅ Configuration looks good!');
  console.log('\n📝 If sign-up still not working:');
  console.log('1. Clear Vercel build cache and redeploy');
  console.log('2. Check Clerk dashboard → Domains');
  console.log('3. Add your Vercel URL to allowed domains');
  console.log('4. Check browser console for errors');
}

console.log('\n🔗 Helpful Links:');
console.log('- Clerk Dashboard: https://dashboard.clerk.com');
console.log('- Clerk Docs: https://clerk.com/docs');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
