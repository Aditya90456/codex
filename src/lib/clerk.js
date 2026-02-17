// Clerk configuration and utilities
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  appearance: {
    theme: {
      primaryColor: '#3b82f6',
      primaryColorText: '#ffffff',
    },
    elements: {
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105',
      card: 'bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl',
      headerTitle: 'text-white text-2xl font-bold',
      headerSubtitle: 'text-gray-300 text-base',
      socialButtonsBlockButton: 'border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 rounded-xl py-3 px-4 font-medium',
      socialButtonsBlockButtonText: 'text-white font-medium',
      formFieldInput: 'bg-gray-800 border-gray-600 text-white rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
      formFieldLabel: 'text-gray-300 font-medium',
      footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium',
      identityPreviewText: 'text-gray-300',
      formResendCodeLink: 'text-blue-400 hover:text-blue-300',
      dividerLine: 'bg-gray-700',
      dividerText: 'text-gray-400',
      socialButtonsProviderIcon: 'w-5 h-5',
    },
  },
  routing: {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    afterSignInUrl: '/leetcode',  // Main coding platform
    afterSignUpUrl: '/leetcode',  // Main coding platform
  },
  // Enhanced SSO configuration
  socialConnections: {
    google: {
      enabled: true,
      strategy: 'oauth_google',
    },
    github: {
      enabled: true,
      strategy: 'oauth_github',
    },
    linkedin: {
      enabled: true,
      strategy: 'oauth_linkedin',
    },
    microsoft: {
      enabled: true,
      strategy: 'oauth_microsoft',
    },
  },
};

// Validate Clerk configuration
export const validateClerkConfig = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('❌ VITE_CLERK_PUBLISHABLE_KEY is missing from environment variables');
    return false;
  }
  
  if (!publishableKey.startsWith('pk_')) {
    console.error('❌ Invalid Clerk publishable key format. Should start with "pk_"');
    return false;
  }
  
  console.log('✅ Clerk configuration is valid');
  return true;
};

// SSO Status Checker
export const checkSSOStatus = async () => {
  try {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) return { enabled: false, providers: [] };

    // This is a basic check - in production you'd want to use Clerk's API
    const ssoStatus = {
      enabled: true,
      providers: [
        { name: 'Google', enabled: true, icon: '🔍' },
        { name: 'GitHub', enabled: true, icon: '🐙' },
        { name: 'LinkedIn', enabled: true, icon: '💼' },
        { name: 'Microsoft', enabled: true, icon: '🪟' },
      ],
      setupRequired: !publishableKey.includes('test') && !publishableKey.includes('live'),
    };

    return ssoStatus;
  } catch (error) {
    console.error('Error checking SSO status:', error);
    return { enabled: false, providers: [], error: error.message };
  }
};

// SSO Provider Configuration
export const ssoProviders = {
  google: {
    name: 'Google',
    icon: '🔍',
    color: 'from-red-500 to-orange-500',
    description: 'Sign in with your Google account',
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    color: 'from-gray-700 to-gray-900',
    description: 'Sign in with your GitHub account',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-600 to-blue-800',
    description: 'Sign in with your LinkedIn account',
  },
  microsoft: {
    name: 'Microsoft',
    icon: '🪟',
    color: 'from-blue-500 to-cyan-500',
    description: 'Sign in with your Microsoft account',
  },
};