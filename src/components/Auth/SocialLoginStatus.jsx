import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Settings, Zap } from 'lucide-react';

const SocialLoginStatus = ({ isVisible = true }) => {
  const [socialProviders, setSocialProviders] = useState({
    google: { enabled: false, configured: false },
    github: { enabled: false, configured: false },
    linkedin: { enabled: false, configured: false }
  });

  const [showDetails, setShowDetails] = useState(false);

  // Check if social providers are working (this is a mock check)
  useEffect(() => {
    // In a real app, you'd check Clerk's configuration
    // For now, we'll assume they need setup
    setSocialProviders({
      google: { enabled: true, configured: false },
      github: { enabled: true, configured: false },
      linkedin: { enabled: true, configured: false }
    });
  }, []);

  if (!isVisible) return null;

  const allConfigured = Object.values(socialProviders).every(provider => provider.configured);
  const anyEnabled = Object.values(socialProviders).some(provider => provider.enabled);

  return (
    <div className="mt-4">
      {/* Status Indicator */}
      <div className={`p-3 rounded-lg border ${
        allConfigured 
          ? 'bg-green-900/20 border-green-500/30' 
          : anyEnabled 
            ? 'bg-yellow-900/20 border-yellow-500/30'
            : 'bg-gray-800/50 border-gray-600/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {allConfigured ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className={`text-sm font-medium ${
              allConfigured ? 'text-green-300' : 'text-yellow-300'
            }`}>
              Social Login Status
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <p className={`text-xs mt-1 ${
          allConfigured ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {allConfigured 
            ? '✅ All social providers are configured and ready'
            : '⚠️ Social login requires OAuth setup in Clerk dashboard'
          }
        </p>

        {/* Detailed Status */}
        {showDetails && (
          <div className="mt-3 space-y-2">
            {Object.entries(socialProviders).map(([provider, status]) => (
              <div key={provider} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status.configured ? 'bg-green-400' : 
                    status.enabled ? 'bg-yellow-400' : 'bg-gray-500'
                  }`} />
                  <span className="capitalize text-gray-300">{provider}</span>
                </div>
                <span className={`${
                  status.configured ? 'text-green-400' : 
                  status.enabled ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {status.configured ? 'Ready' : status.enabled ? 'Needs Setup' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Setup Instructions */}
        {!allConfigured && showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-600/30">
            <div className="flex items-start space-x-2">
              <Settings className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-300">
                <p className="font-medium mb-1">Quick Setup:</p>
                <ol className="space-y-1 text-gray-400">
                  <li>1. Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
                    dashboard.clerk.com <ExternalLink className="w-3 h-3 ml-1" />
                  </a></li>
                  <li>2. Navigate to "Social Connections"</li>
                  <li>3. Enable and configure OAuth providers</li>
                  <li>4. Add redirect URLs for your domain</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {!allConfigured && (
          <div className="mt-3 pt-3 border-t border-gray-600/30">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300">
                Demo mode available - instant sign up without OAuth setup
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLoginStatus;