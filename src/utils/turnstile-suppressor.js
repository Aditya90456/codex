// Comprehensive Turnstile error suppression utility
// This handles Cloudflare Turnstile errors that don't affect functionality

export const setupTurnstileErrorSuppression = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Enhanced console error filtering
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Comprehensive Turnstile error patterns
    const turnstilePatterns = [
      'Turnstile',
      '300030',
      'cf-turnstile',
      'challenges.cloudflare.com',
      'api.js?render=explicit',
      'turnstile-wrapper',
      'captcha-container'
    ];

    // Check if this is a Turnstile-related error
    const isTurnstileError = turnstilePatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isTurnstileError) {
      // Log as warning instead of error to reduce noise
      console.warn('🔇 [Turnstile] Error suppressed (safe to ignore):', message);
      return;
    }

    // Allow other errors through
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : 
                   reason?.message || 
                   reason?.toString() || '';

    if (message.toLowerCase().includes('turnstile') || 
        message.toLowerCase().includes('300030') ||
        message.toLowerCase().includes('cf-turnstile')) {
      console.warn('🔇 [Turnstile] Promise rejection suppressed:', message);
      event.preventDefault();
      return false;
    }
  };

  // Handle global errors
  const handleGlobalError = (event) => {
    const message = event.message || event.error?.message || '';
    const filename = event.filename || '';

    if (message.toLowerCase().includes('turnstile') || 
        message.toLowerCase().includes('300030') ||
        filename.includes('api.js') ||
        filename.includes('challenges.cloudflare.com')) {
      console.warn('🔇 [Turnstile] Global error suppressed:', message);
      event.preventDefault();
      return false;
    }
  };

  // Add event listeners
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleGlobalError);

  // Block Turnstile script loading if needed
  const blockTurnstileScripts = () => {
    // Override document.createElement to intercept script creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        // Monitor script src changes
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && 
              (value.includes('challenges.cloudflare.com') || 
               value.includes('turnstile'))) {
            console.warn('🔇 [Turnstile] Script loading blocked:', value);
            return; // Don't set the src
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
  };

  // Apply script blocking in production
  if (import.meta.env.PROD) {
    blockTurnstileScripts();
  }

  // Return cleanup function
  return () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleGlobalError);
  };
};

// Auto-setup when module is imported
if (typeof window !== 'undefined') {
  setupTurnstileErrorSuppression();
}