import { SignIn, SignUp } from '@clerk/clerk-react';
import { X, Zap, Rocket } from 'lucide-react';

const ClerkAuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  if (!isOpen) return null;

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

        {/* Fast Auth Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'sign-in' ? 'Fast Sign In' : 'Quick Sign Up'}
            </h2>
            <Rocket className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-gray-300 text-sm text-center mb-4">
            {mode === 'sign-in' 
              ? '⚡ Sign in and get redirected to Codex Playground in 2 seconds'
              : '🚀 Create account and start coding immediately'
            }
          </p>
        </div>

        {/* Clerk Auth Component */}
        <div className="px-6 pb-6">
          {mode === 'sign-in' ? (
            <SignIn 
              afterSignInUrl="/"
              signUpUrl="#"
              appearance={{
                baseTheme: 'dark',
                variables: {
                  colorPrimary: '#7C3AED',
                  colorBackground: 'transparent',
                  colorInputBackground: '#1E293B',
                  colorInputText: '#F1F5F9',
                  borderRadius: '0.75rem',
                },
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white text-lg font-bold',
                  headerSubtitle: 'text-gray-300 text-sm',
                  socialButtonsBlockButton: 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition-colors',
                  formFieldInput: 'bg-gray-800 border-gray-600 text-white rounded-xl focus:border-purple-500',
                  formFieldLabel: 'text-gray-300 font-medium',
                  dividerLine: 'bg-gray-600',
                  dividerText: 'text-gray-400',
                  footerActionLink: 'text-purple-400 hover:text-purple-300',
                }
              }}
            />
          ) : (
            <SignUp 
              afterSignUpUrl="/"
              signInUrl="#"
              appearance={{
                baseTheme: 'dark',
                variables: {
                  colorPrimary: '#7C3AED',
                  colorBackground: 'transparent',
                  colorInputBackground: '#1E293B',
                  colorInputText: '#F1F5F9',
                  borderRadius: '0.75rem',
                },
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white text-lg font-bold',
                  headerSubtitle: 'text-gray-300 text-sm',
                  socialButtonsBlockButton: 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition-colors',
                  formFieldInput: 'bg-gray-800 border-gray-600 text-white rounded-xl focus:border-purple-500',
                  formFieldLabel: 'text-gray-300 font-medium',
                  dividerLine: 'bg-gray-600',
                  dividerText: 'text-gray-400',
                  footerActionLink: 'text-purple-400 hover:text-purple-300',
                }
              }}
            />
          )}
        </div>

        {/* Fast Auth Features */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>2s redirect</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Auto-login</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Secure auth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Fast setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuthModal;