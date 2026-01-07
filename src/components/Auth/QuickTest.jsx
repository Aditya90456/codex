import { useState } from 'react';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import { Zap, CheckCircle, XCircle, User, LogOut } from 'lucide-react';

const QuickTest = () => {
  const { user, isAuthenticated, authType, login, logout } = useUniversalAuth();
  const [showTest, setShowTest] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const testFastAuth = () => {
    const testUser = {
      id: 'test_' + Date.now(),
      email: 'test@codex.dev',
      username: 'test_user',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      isTest: true
    };

    console.log('🧪 Testing fast auth...');
    if (login) {
      login(testUser);
      console.log('✅ Fast auth test successful');
    } else {
      console.error('❌ Login function not available');
    }
  };

  if (!showTest) {
    return (
      <button
        onClick={() => setShowTest(true)}
        className="fixed bottom-16 left-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs z-50 flex items-center space-x-1"
      >
        <Zap className="w-3 h-3" />
        <span>Quick Test</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 left-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-xs text-white z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-400 flex items-center space-x-1">
          <Zap className="w-4 h-4" />
          <span>Quick Test</span>
        </h3>
        <button
          onClick={() => setShowTest(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        {/* Auth Status */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span>Auth: {isAuthenticated ? 'Active' : 'None'}</span>
        </div>

        {/* Auth Type */}
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Type: {authType || 'Unknown'}</span>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="truncate">User: {user.username}</span>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-2 pt-2 border-t border-gray-700">
          {!isAuthenticated ? (
            <button
              onClick={testFastAuth}
              className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1"
            >
              <Zap className="w-3 h-3" />
              <span>Test Fast Auth</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Test Logout</span>
            </button>
          )}
        </div>

        {/* Status */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          {isAuthenticated ? (
            <p className="text-green-400">✅ Fast auth working!</p>
          ) : (
            <p>Click test button to verify auth</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickTest;