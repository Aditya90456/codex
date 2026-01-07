import { useState } from 'react';
import { AlertCircle, ExternalLink, Copy, CheckCircle } from 'lucide-react';

const ClerkSetupGuide = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl max-w-2xl w-full relative border border-gray-700/50 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 z-10 p-2 hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Clerk Setup Required</h2>
            <p className="text-gray-400">
              Your Clerk publishable key needs to be configured for authentication to work
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Get Your Clerk Key</h3>
                  <p className="text-gray-400 mb-4">
                    Go to your Clerk dashboard and copy your publishable key
                  </p>
                  <a
                    href="https://dashboard.clerk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                  >
                    <span>Open Clerk Dashboard</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Update .env File</h3>
                  <p className="text-gray-400 mb-4">
                    Replace the placeholder with your real Clerk key
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">/.env</span>
                      <button
                        onClick={() => copyToClipboard('VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key-here')}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <code className="text-green-400">
                      VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key-here
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Restart Server</h3>
                  <p className="text-gray-400 mb-4">
                    Stop and restart your development server to load the new key
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <code className="text-yellow-400">npm run dev</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Need Help?</span>
            </div>
            <p className="text-xs text-gray-300">
              Check the CLERK_COMPLETE_SETUP.md file in your project root for detailed instructions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkSetupGuide;