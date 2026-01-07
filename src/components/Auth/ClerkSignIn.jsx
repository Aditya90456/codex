import { SignIn } from '@clerk/clerk-react';
import { X, LogIn, Zap, Code, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useRef, useState, useEffect } from 'react';
import ScrollIndicator from './ScrollIndicator';
import FastSignUp from './FastSignUp';

const ClerkSignIn = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [isClerkLoading, setIsClerkLoading] = useState(true);
  const [clerkError, setClerkError] = useState(null);
  const [showFastAuth, setShowFastAuth] = useState(false);
  
  // Check if we're properly wrapped in ClerkProvider
  let isClerkAvailable = false;
  let clerk = null;
  
  try {
    clerk = useClerk();
    const auth = useAuth();
    isClerkAvailable = !!(clerk && auth);
  } catch (error) {
    console.warn('Clerk not available:', error.message);
    setClerkError(error);
  }

  // Check Clerk loading state
  useEffect(() => {
    if (!isOpen) return;

    const checkClerkReady = async () => {
      try {
        if (clerk) {
          // Wait for Clerk to be fully loaded
          await new Promise(resolve => {
            if (clerk.loaded) {
              resolve();
            } else {
              clerk.addListener('load', resolve);
            }
          });
          setIsClerkLoading(false);
        } else {
          // No Clerk available, show fast auth after delay
          setTimeout(() => {
            setIsClerkLoading(false);
            setShowFastAuth(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Clerk loading error:', error);
        setClerkError(error);
        setIsClerkLoading(false);
        setShowFastAuth(true);
      }
    };

    checkClerkReady();
  }, [isOpen, clerk]);

  if (!isOpen) return null;

  // Show loading state while Clerk is initializing
  if (isClerkLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md w-full relative border border-gray-700 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Loading Sign In</h2>
            <p className="text-gray-300 mb-6">
              Initializing Clerk authentication...
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-400">
              This usually takes 2-3 seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show FastAuth if Clerk is not available or there's an error
  if (showFastAuth || clerkError || !isClerkAvailable) {
    return (
      <FastSignUp
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToSignIn={() => {}} // Already in sign in mode
        onSignUp={(userData) => {
          console.log('Fast auth completed:', userData);
          onClose();
        }}
      />
    );
  }

  // If Clerk is available, show the Clerk sign in form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md w-full relative border border-gray-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-gray-300 text-sm mb-4">
            ⚡ Sign in and get redirected to Codex Playground in seconds
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="px-6 pb-6 max-h-96 overflow-y-auto scroll-smooth scroll-container">
          <SignIn 
            routing="hash"
            afterSignInUrl={window.location.origin}
            signUpUrl={window.location.origin + "#sign-up"}
            appearance={{
              baseTheme: 'dark',
              variables: {
                colorPrimary: '#3B82F6',
                colorBackground: 'transparent',
                colorInputBackground: '#1E293B',
                colorInputText: '#F1F5F9',
                borderRadius: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#3B82F6',
                  '&:hover': {
                    backgroundColor: '#2563EB',
                  },
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                },
                card: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                },
                headerTitle: {
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '700',
                },
                headerSubtitle: {
                  color: '#D1D5DB',
                  fontSize: '14px',
                },
                socialButtonsBlockButton: {
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 16px',
                  '&:hover': {
                    backgroundColor: '#4B5563',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                },
                socialButtonsBlockButtonText: {
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                formFieldInput: {
                  backgroundColor: '#1E293B',
                  border: '1px solid #4B5563',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '14px',
                  '&:focus': {
                    borderColor: '#3B82F6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                },
                formFieldLabel: {
                  color: '#D1D5DB',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                dividerLine: {
                  backgroundColor: '#4B5563',
                },
                dividerText: {
                  color: '#9CA3AF',
                  fontSize: '12px',
                },
                footerActionLink: {
                  color: '#60A5FA',
                  '&:hover': {
                    color: '#3B82F6',
                  },
                },
                identityPreviewText: {
                  color: '#D1D5DB',
                },
                identityPreviewEditButton: {
                  color: '#60A5FA',
                },
                formResendCodeLink: {
                  color: '#60A5FA',
                },
                otpCodeFieldInput: {
                  backgroundColor: '#1E293B',
                  border: '1px solid #4B5563',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                },
              }
            }}
          />
          
          {/* Social Login Status */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              💡 Social login (Google, GitHub, LinkedIn) requires setup in Clerk dashboard
            </p>
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create one now
              </button>
            </p>
          </div>
        </div>

        {/* Quick Access Features */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">Quick access to:</p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Code className="w-3 h-3 text-blue-400" />
                <span>Code Editor</span>
              </div>
              <ArrowRight className="w-3 h-3 text-gray-600" />
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Instant Coding</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkSignIn;