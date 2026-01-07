import { useState, useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useClerk, useAuth } from '@clerk/clerk-react';

const SignUpDebug = ({ isOpen, onClose }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        clerkLoaded: !!clerk,
        authLoaded: isLoaded,
        isSignedIn: isSignedIn,
        publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Present' : 'Missing',
        timestamp: new Date().toLocaleTimeString()
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [clerk, isLoaded, isSignedIn]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl max-w-2xl w-full relative border border-gray-700/50 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 z-10 p-2 hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          ✕
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Clerk Sign Up Debug</h2>
          
          {/* Debug Info */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Debug Information</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-400">{key}:</span>
                  <span className={`${
                    value === true || value === 'Present' ? 'text-green-400' : 
                    value === false || value === 'Missing' ? 'text-red-400' : 
                    'text-white'
                  }`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clerk SignUp Component */}
          <div className="clerk-debug-container">
            {isLoaded && clerk ? (
              <SignUp
                routing="virtual"
                afterSignUpUrl={window.location.origin}
                appearance={{
                  baseTheme: 'dark',
                  variables: {
                    colorPrimary: '#8B5CF6',
                    colorBackground: '#1F2937',
                    colorInputBackground: '#374151',
                    colorInputText: '#F9FAFB',
                    borderRadius: '8px',
                  },
                  elements: {
                    card: {
                      backgroundColor: '#1F2937',
                      border: '1px solid #4B5563',
                    },
                    formButtonPrimary: {
                      backgroundColor: '#8B5CF6',
                      '&:hover': { backgroundColor: '#7C3AED' },
                    },
                  }
                }}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-red-400 mb-2">⚠️ Clerk Not Ready</div>
                <div className="text-gray-400 text-sm">
                  Clerk is not loaded or not available
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpDebug;