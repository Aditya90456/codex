import { useState, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { 
  X, 
  Sparkles,                          
  ArrowRight, 
  Github, 
  Chrome,
  Linkedin,
  Mail,
  Lock,
  User,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth, useClerk } from '@clerk/clerk-react';

const ClerkRedesigned = ({ isOpen, onClose, mode = 'signup', onSwitchMode }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  // Initialize Clerk
  useEffect(() => {
    if (isLoaded && clerk) {
      console.log('✅ Clerk is ready and available');
      setTimeout(() => setIsLoading(false), 500);
    } else if (isLoaded && !clerk) {
      console.error('❌ Clerk failed to initialize');
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isLoaded, clerk]);

  // Close modal when user is signed in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      console.log('✅ User signed in, closing modal');
      setTimeout(() => {
        onClose();
        // Refresh the page to ensure proper state update
        window.location.reload();
      }, 1000); // Give time for the success message
    }
  }, [isSignedIn, isLoaded, onClose]);

  const handleDemoAuth = (e) => {
    e.preventDefault();
    console.log('Demo mode disabled - please use Clerk authentication');
    onClose();
  };

  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    if (onSwitchMode) onSwitchMode(newMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl max-w-md w-full relative border border-gray-700/50 shadow-2xl overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 z-10 p-2 hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="relative p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Initializing Auth</h2>
            <p className="text-gray-400 text-sm">Setting up your authentication experience...</p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-1">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <div className="relative">
            {/* Header */}
            <div className="p-6 pb-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  currentMode === 'signup' 
                    ? 'from-purple-600 to-pink-600' 
                    : 'from-blue-600 to-cyan-600'
                } rounded-2xl flex items-center justify-center shadow-lg`}>
                  {currentMode === 'signup' ? (
                    <Users className="w-6 h-6 text-white" />
                  ) : (
                    <Shield className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {currentMode === 'signup' ? 'Join Codex' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {currentMode === 'signup' ? 'Start your coding journey' : 'Continue coding'}
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6 backdrop-blur-sm">
                <button
                  onClick={() => switchMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentMode === 'signin'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentMode === 'signup'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Clerk Forms */}
            <div className="px-6 pb-6">
              {isLoaded && clerk ? (
                <div className="clerk-container">
                  {currentMode === 'signup' ? (
                    <SignUp
                      routing="virtual"
                      afterSignUpUrl="/"
                      signInUrl="/"
                      redirectUrl="/"
                      appearance={{
                        baseTheme: 'dark',
                        variables: {
                          colorPrimary: '#8B5CF6',
                          colorBackground: 'transparent',
                          colorInputBackground: '#1E293B',
                          colorInputText: '#F1F5F9',
                          borderRadius: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        },
                        elements: {
                          formButtonPrimary: {
                            backgroundColor: '#8B5CF6',
                            '&:hover': { backgroundColor: '#7C3AED' },
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            padding: '12px 24px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                          },
                          card: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            border: 'none',
                          },
                          headerTitle: { display: 'none' },
                          headerSubtitle: { display: 'none' },
                          socialButtonsBlockButton: {
                            backgroundColor: '#374151',
                            border: '1px solid #4B5563',
                            borderRadius: '12px',
                            '&:hover': {
                              backgroundColor: '#4B5563',
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          },
                          formFieldInput: {
                            backgroundColor: '#1E293B',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            '&:focus': {
                              borderColor: '#8B5CF6',
                              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                            },
                          },
                        }
                      }}
                    />
                  ) : (
                    <SignIn
                      routing="virtual"
                      afterSignInUrl="/"
                      signUpUrl="/"
                      redirectUrl="/"
                      appearance={{
                        baseTheme: 'dark',
                        variables: {
                          colorPrimary: '#3B82F6',
                          colorBackground: 'transparent',
                          colorInputBackground: '#1E293B',
                          colorInputText: '#F1F5F9',
                          borderRadius: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        },
                        elements: {
                          formButtonPrimary: {
                            backgroundColor: '#3B82F6',
                            '&:hover': { backgroundColor: '#2563EB' },
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            padding: '12px 24px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          },
                          card: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            border: 'none',
                          },
                          headerTitle: { display: 'none' },
                          headerSubtitle: { display: 'none' },
                          socialButtonsBlockButton: {
                            backgroundColor: '#374151',
                            border: '1px solid #4B5563',
                            borderRadius: '12px',
                            '&:hover': {
                              backgroundColor: '#4B5563',
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          },
                          formFieldInput: {
                            backgroundColor: '#1E293B',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            '&:focus': {
                              borderColor: '#3B82F6',
                              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                            },
                          },
                        }
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Clerk Not Available</h3>
                  <p className="text-gray-400 mb-4">
                    Please check your Clerk configuration and try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Social Login Status */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Clerk Authentication Ready</span>
                </div>
                <p className="text-xs text-gray-300 mb-3">
                  Full authentication with social providers available
                </p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Chrome className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Google</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Github className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">GitHub</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Linkedin className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">LinkedIn</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 border-t border-gray-700/50">
              <div className="text-center">
                {/* Manual Navigation Links */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <button
                    onClick={() => switchMode(currentMode === 'signup' ? 'signin' : 'signup')}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm underline transition-colors"
                  >
                    {currentMode === 'signup' ? 'Sign in here' : 'Sign up here'}
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span>Fast Setup</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-400" />
                    <span>Ready to Code</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Join thousands of developers building amazing projects
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkRedesigned;