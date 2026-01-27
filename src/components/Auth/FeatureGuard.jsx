import { useAuth } from '../../contexts/SimpleClerkAuth';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { Lock, User, Zap, Code, Trophy, Brain } from 'lucide-react';

/**
 * FeatureGuard component - Shows login prompt for specific features
 * More granular than AuthGuard, can be used to protect individual features within a page
 */
function FeatureGuard({ 
  children, 
  feature = "this feature",
  description = "Please sign in to access this feature",
  icon: Icon = Lock,
  showInlineAuth = false,
  className = ""
}) {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState('sign-up');

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // If authenticated, show the protected content
  if (isAuthenticated) {
    return children;
  }

  // Show inline authentication form
  if (showInlineAuth) {
    return (
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sign in Required</h3>
          <p className="text-gray-400">{description}</p>
        </div>

        <div className="max-w-md mx-auto">
          {authMode === 'sign-in' ? (
            <div>
              <SignIn 
                routing="virtual"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent"
                  }
                }}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setAuthMode('sign-up')}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </div>
          ) : (
            <div>
              <SignUp 
                routing="virtual"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent"
                  }
                }}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setAuthMode('sign-in')}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show feature locked message with call-to-action
  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8 text-center ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">
        Unlock {feature}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <User className="w-5 h-5" />
          <span>Sign Up Free</span>
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-lg font-semibold text-gray-300 hover:text-white transition-all duration-300"
        >
          Sign In
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-500 mb-4">What you'll get with a free account:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Code className="w-4 h-4 text-blue-400" />
            <span>Full IDE Access</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>DSA Problems</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Code Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureGuard;