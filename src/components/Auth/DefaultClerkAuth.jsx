import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useEffect } from 'react';

const DefaultClerkAuth = ({ mode = 'signup' }) => {
  // Handle Turnstile errors
  useEffect(() => {
    // Suppress Turnstile console errors in development
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('Turnstile') && message.includes('300030')) {
        console.warn('Turnstile error suppressed (safe to ignore in development):', message);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);
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
                    appearance={{
                      elements: {
                        formButtonPrimary: {
                          backgroundColor: '#8B5CF6',
                          '&:hover': { backgroundColor: '#7C3AED' },
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600'
                        },
                        footerActionLink: {
                          color: '#8B5CF6',
                          '&:hover': { color: '#7C3AED' }
                        },
                        card: {
                          boxShadow: 'none',
                          border: 'none'
                        },
                        // Handle Turnstile/Captcha container
                        captcha: {
                          marginTop: '16px',
                          marginBottom: '16px'
                        },
                        formFieldInput: {
                          borderRadius: '8px'
                        }
                      }
                    }}
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
                    appearance={{
                      elements: {
                        formButtonPrimary: {
                          backgroundColor: '#3B82F6',
                          '&:hover': { backgroundColor: '#2563EB' },
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600'
                        },
                        footerActionLink: {
                          color: '#3B82F6',
                          '&:hover': { color: '#2563EB' }
                        },
                        card: {
                          boxShadow: 'none',
                          border: 'none'
                        },
                        // Handle Turnstile/Captcha container
                        captcha: {
                          marginTop: '16px',
                          marginBottom: '16px'
                        },
                        formFieldInput: {
                          borderRadius: '8px'
                        }
                      }
                    }}
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