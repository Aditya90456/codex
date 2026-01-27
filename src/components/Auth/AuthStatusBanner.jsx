import { useAuth } from '../../contexts/SimpleClerkAuth';
import { Lock, User, Zap, Code, Trophy, Brain, Star, CheckCircle } from 'lucide-react';

/**
 * AuthStatusBanner - Shows authentication status and encourages sign-up
 * Displays different content based on authentication state
 */
function AuthStatusBanner({ onShowAuth, className = "" }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`bg-gray-800/50 rounded-xl border border-gray-700 p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Welcome back, {user?.name || 'User'}!</h3>
              <p className="text-green-300 text-sm">All features unlocked</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-300">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Access</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Sign up to unlock all features
        </h3>
        
        <p className="text-gray-300 mb-6">
          Get instant access to our complete development environment
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm text-gray-300">Multi-Language IDE</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm text-gray-300">AI Code Assistant</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-300">DSA Problems</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm text-gray-300">Real-time Execution</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onShowAuth('signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <User className="w-5 h-5" />
            <span>Sign Up Free</span>
          </button>
          
          <button
            onClick={() => onShowAuth('signin')}
            className="border border-gray-600 hover:border-gray-500 px-8 py-3 rounded-lg font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-gray-700/50"
          >
            Already have an account?
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Free forever • No credit card required • Start coding in seconds
        </p>
      </div>
    </div>
  );
}

export default AuthStatusBanner;