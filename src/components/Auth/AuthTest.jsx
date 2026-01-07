import { useState } from 'react';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import { CheckCircle, XCircle, AlertTriangle, User, LogIn, UserPlus } from 'lucide-react';

const AuthTest = () => {
  const { user, isAuthenticated, authType, login, logout } = useUniversalAuth();
  const [showTest, setShowTest] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!showTest) {
    return (
      <button
        onClick={() => setShowTest(true)}
        className="fixed bottom-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm z-50"
      >
        Test Auth
      </button>
    );
  }

  const getStatusIcon = () => {
    if (isAuthenticated) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const testSignUp = () => {
    // Simulate clicking a sign up button
    const signUpButton = document.querySelector('[data-testid="signup-button"]') || 
                        document.querySelector('button:contains("Get Started")') ||
                        document.querySelector('button:contains("Sign Up")');
    
    if (signUpButton) {
      signUpButton.click();
      return true;
    }
    return false;
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm text-white z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-green-400">🧪 Auth Test</h3>
        <button
          onClick={() => setShowTest(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Auth Status */}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>
            Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>

        {/* Auth Type */}
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span>Method: {authType || 'Unknown'}</span>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="truncate">User: {user.username || user.email}</span>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <button
            onClick={testSignUp}
            className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1"
          >
            <UserPlus className="w-3 h-3" />
            <span>Test Sign Up Button</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Test Logout</span>
            </button>
          ) : (
            <button
              onClick={() => console.log('Login test - click a sign up button')}
              className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Test Login</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p>• Click "Test Sign Up Button" to test auth flow</p>
          <p>• Check console for detailed logs</p>
          <p>• Try both Clerk and Simple auth</p>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;