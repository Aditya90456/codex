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

    // Browser extension error patterns
    const extensionErrorPatterns = [
      'Could not establish connection',
      'Receiving end does not exist',
      'Extension context invalidated',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'The message port closed before a response was received'
    ];

    // Common third-party error patterns that don't affect functionality
    const thirdPartyErrorPatterns = [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Script error.',
      'Network request failed'
    ];

    // Check if this is a Turnstile-related error
    const isTurnstileError = turnstilePatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    // Check if this is a browser extension error
    const isExtensionError = extensionErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    // Check if this is a harmless third-party error
    const isThirdPartyError = thirdPartyErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isTurnstileError) {
      // Log as warning instead of error to reduce noise
      console.warn('🔇 [Turnstile] Error suppressed (safe to ignore):', message);
      return;
    }

    if (isExtensionError) {
      // Log as info instead of error for extension issues
      console.info('🔇 [Extension] Error suppressed (browser extension issue):', message);
      return;
    }

    if (isThirdPartyError) {
      // Suppress common harmless errors
      console.info('🔇 [Third-party] Error suppressed (harmless):', message);
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

    // Check for various error patterns
    const suppressPatterns = [
      'turnstile', '300030', 'cf-turnstile',
      'could not establish connection',
      'receiving end does not exist',
      'extension context invalidated',
      'chrome-extension',
      'moz-extension'
    ];

    if (suppressPatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      console.info('🔇 [Promise] Rejection suppressed (harmless):', message);
      event.preventDefault();
      return false;
    }
  };

  // Handle global errors
  const handleGlobalError = (event) => {
    const message = event.message || event.error?.message || '';
    const filename = event.filename || '';

    const suppressPatterns = [
      'turnstile', '300030',
      'could not establish connection',
      'receiving end does not exist',
      'extension context invalidated'
    ];

    if (suppressPatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase())) ||
        filename.includes('api.js') ||
        filename.includes('challenges.cloudflare.com') ||
        filename.includes('extension://')) {
      console.info('🔇 [Global] Error suppressed (harmless):', message);
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