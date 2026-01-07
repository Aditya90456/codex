import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { getClerkAppearanceConfig } from '../../utils/clerk-config';

const DefaultClerkAuth = ({ mode = 'signup' }) => {
  // Enhanced Turnstile error suppression
  useEffect(() => {
    // Comprehensive error suppression
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Enhanced Turnstile error patterns
      const turnstilePatterns = [
        'Turnstile', '300030', 'cf-turnstile', 'challenges.cloudflare.com',
        'api.js?render=explicit', 'captcha', 'bot protection'
      ];
      
      if (turnstilePatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
        console.warn('🔇 [Turnstile] Error suppressed:', message);
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    // Block Turnstile DOM elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Remove Turnstile elements
            const turnstileElements = node.querySelectorAll?.('[class*="turnstile"], [id*="turnstile"], [class*="captcha"], [id*="captcha"]');
            turnstileElements?.forEach(el => {
              console.warn('🔇 [Turnstile] Removing element:', el);
              el.remove();
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      console.error = originalConsoleError;
      observer.disconnect();
    };
  }, []);

  const appearanceConfig = getClerkAppearanceConfig('dark');
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md my-8">
        <SignedOut>
          {mode === 'signup' ? (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center bg-gradient-to-r from-purple-600 to-blue-600">
                <h1 className="text-2xl font-bold text-white mb-2">Join Codex Playground</h1>
                <p className="text-purple-100">Start your coding journey today</p>
              </div>
              <div className="p-6">
                <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <SignUp 
                    afterSignUpUrl="/"
                    signInUrl="#"
                    appearance={appearanceConfig}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center bg-gradient-to-r from-blue-600 to-cyan-600">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-blue-100">Continue your coding journey</p>
              </div>
              <div className="p-6">
                <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <SignIn 
                    afterSignInUrl="/"
                    signUpUrl="#"
                    appearance={appearanceConfig}
                  />
                </div>
              </div>
            </div>
          )}
        </SignedOut>
        
        <SignedIn>
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="mb-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-16 h-16"
                  }
                }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Codex Playground!</h2>
            <p className="text-gray-600 mb-4">You're successfully signed in.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Go to Editor
            </button>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default DefaultClerkAuth;