import { useState } from 'react';
import { Zap, ArrowRight, User, Mail, X } from 'lucide-react';

const FastAuth = ({ isOpen, onAuth, onClose }) => {
  const [email, setEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleFastAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Ultra-fast authentication - no validation, no verification
    const userData = {
      id: Date.now().toString(),
      email: email || 'demo@codex.dev',
      username: email ? email.split('@')[0] : 'developer',
      firstName: 'Developer',
      lastName: '',
      createdAt: new Date().toISOString(),
      fastAuth: true
    };

    // Simulate minimal processing time (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('⚡ Fast auth complete in 100ms');
    onAuth(userData);
  };

  const handleInstantDemo = () => {
    // Instant demo access - no form, no waiting
    const demoUser = {
      id: 'demo_' + Date.now(),
      email: 'demo@codex.dev',
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      isDemo: true
    };

    console.log('⚡ Instant demo access');
    onAuth(demoUser);
  };

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

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Lightning Fast Access</h2>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            ⚡ Get authorized in under 1 second
          </p>
        </div>



        {/* Fast Email Auth */}
        <form onSubmit={handleFastAuth} className="px-6 pb-6">
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email (optional)"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 p-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            {isAuthenticating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Fast Email Access</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            No verification • No password • Instant access
          </p>
        </form>

        {/* Features */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-400 text-center">
            <div>
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span>0.1s Auth</span>
            </div>
            <div>
              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <span>No Verification</span>
            </div>
            <div>
              <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-1"></div>
              <span>Instant Coding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastAuth;