// Environment variable checker
export const checkEnvVars = () => {
  const requiredVars = {
    'VITE_CLERK_PUBLISHABLE_KEY': import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_RAZORPAY_KEY_ID': import.meta.env.VITE_RAZORPAY_KEY_ID,
  };

  console.log('Environment Variables Check:');
  Object.entries(requiredVars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✅ Set' : '❌ Missing'}`);
    if (value) {
      console.log(`  Value: ${value.substring(0, 20)}...`);
    }
  });

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }

  return true;
};

export default checkEnvVars;