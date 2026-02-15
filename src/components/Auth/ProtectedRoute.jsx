import { useAuthContext } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Lock, LogIn, UserPlus } from 'lucide-react';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { isSignedIn, isLoaded } = useAuthContext();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <div className="mb-6">
            <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400">
              Please sign in to access this feature
            </p>
          </div>
          
          <div className="space-y-3">
            <SignInButton 
              mode="redirect" 
              redirectUrl={location.pathname}
              fallbackRedirectUrl={location.pathname}
            >
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <LogIn size={20} />
                Sign In
              </button>
            </SignInButton>
            
            <SignUpButton 
              mode="redirect"
              redirectUrl={location.pathname}
              fallbackRedirectUrl={location.pathname}
            >
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 transition-colors">
                <UserPlus size={20} />
                Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;