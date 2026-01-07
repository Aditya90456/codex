import { useState } from 'react';
import ClerkAuthModal from './ClerkAuthModal';
import SimpleAuthModal from './SimpleAuthModal';
import { AlertTriangle, Zap, User } from 'lucide-react';

const AuthSwitcher = ({ isOpen, onClose, mode = 'sign-in', onSimpleAuth }) => {
  const [authType, setAuthType] = useState('clerk'); // 'clerk' or 'simple'
  const [showClerkError, setShowClerkError] = useState(false);

  if (!isOpen) return null;

  // If Clerk is having issues, show fallback option
  if (showClerkError || authType === 'simple') {
    return (
      <SimpleAuthModal
        isOpen={isOpen}
        onClose={onClose}
        mode={mode === 'sign-in' ? 'login' : 'signup'}
        onAuth={onSimpleAuth}
      />
    );
  }

  return (
    <>
      <ClerkAuthModal
        isOpen={isOpen}
        onClose={onClose}
        mode={mode}
      />
      
      {/* Fallback Button - shows if Clerk fails */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-yellow-900/90 border border-yellow-700 rounded-lg p-3 max-w-sm">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 text-xs font-medium">
                Having trouble with sign up?
              </p>
              <button
                onClick={() => setAuthType('simple')}
                className="mt-2 flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                <User className="w-3 h-3" />
                <span>Try Simple Auth</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthSwitcher;