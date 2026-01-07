import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Settings, CheckCircle, XCircle } from 'lucide-react';
import SimpleAuthModal from './SimpleAuthModal';

const AuthFix = ({ onAuthSuccess }) => {
  const [authMethod, setAuthMethod] = useState('clerk'); // 'clerk' or 'simple'
  const [showSimpleAuth, setShowSimpleAuth] = useState(false);
  const [clerkStatus, setClerkStatus] = useState('checking');
  const [authMode, setAuthMode] = useState('signup');

  useEffect(() => {
    // Check Clerk status
    const checkClerk = async () => {
      try {
        const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
        
        if (!publishableKey) {
          setClerkStatus('missing-key');
          return;
        }

        if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
          setClerkStatus('invalid-key');
          return;
        }

        // Try to load Clerk
        const response = await fetch(`https://api.clerk.dev/v1/public/publishable_key/${publishableKey}`, {
          method: 'HEAD'
        });

        if (response.ok) {
          setClerkStatus('working');
        } else {
          setClerkStatus('invalid-key');
        }
      } catch (error) {
        console.error('Clerk check failed:', error);
        setClerkStatus('network-error');
      }
    };

    checkClerk();
  }, []);

  const handleSimpleAuth = (userData) => {
    // Store user data
    localStorage.setItem('codex_user', JSON.stringify(userData));
    localStorage.setItem('codex_auth_token', 'simple_token_' + Date.now());
    
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  const getStatusIcon = () => {
    switch (clerkStatus) {
      case 'working':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (clerkStatus) {
      case 'working':
        return 'Clerk authentication is working';
      case 'checking':
        return 'Checking Clerk connection...';
      case 'missing-key':
        return 'Clerk publishable key is missing';
      case 'invalid-key':
        return 'Clerk publishable key is invalid';
      case 'network-error':
        return 'Cannot connect to Clerk servers';
      default:
        return 'Authentication system error';
    }
  };

  if (clerkStatus === 'working') {
    return null; // Let Clerk handle authentication
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
        {/* Status Header */}
        <div className="flex items-center space-x-3 mb-6">
          {getStatusIcon()}
          <div>
            <h3 className="text-white font-semibold">Authentication Status</h3>
            <p className="text-gray-400 text-sm">{getStatusMessage()}</p>
          </div>
        </div>

        {/* Issue Details */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-300 font-medium mb-2">Authentication Issue Detected</h4>
              <div className="text-yellow-200 text-sm space-y-1">
                {clerkStatus === 'missing-key' && (
                  <p>• Clerk publishable key is not configured</p>
                )}
                {clerkStatus === 'invalid-key' && (
                  <p>• Clerk publishable key appears to be invalid or corrupted</p>
                )}
                {clerkStatus === 'network-error' && (
                  <p>• Cannot connect to Clerk authentication servers</p>
                )}
                <p>• Using fallback authentication system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-3">Choose Authentication Method:</h4>
            
            <div className="space-y-3">
              {/* Simple Auth Option */}
              <button
                onClick={() => setShowSimpleAuth(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-xl transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Continue with Simple Auth</div>
                    <div className="text-blue-200 text-sm">Quick setup, works offline</div>
                  </div>
                  <div className="text-blue-200">→</div>
                </div>
              </button>

              {/* Fix Clerk Option */}
              <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Settings className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-2">Fix Clerk Authentication</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>1. Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Clerk Dashboard</a></p>
                      <p>2. Copy your publishable key</p>
                      <p>3. Update your .env file:</p>
                      <code className="block bg-gray-900 p-2 rounded mt-2 text-xs">
                        VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
                      </code>
                      <p>4. Restart your development server</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Auth Modal */}
      <SimpleAuthModal
        isOpen={showSimpleAuth}
        onClose={() => setShowSimpleAuth(false)}
        mode={authMode}
        onAuth={handleSimpleAuth}
      />
    </div>
  );
};

export default AuthFix;