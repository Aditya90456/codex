import { useState, useEffect } from 'react';
import { checkSSOStatus, ssoProviders } from '../../lib/clerk';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const SSOStatus = () => {
  const [ssoStatus, setSSOStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSSOStatus();
        setSSOStatus(status);
      } catch (error) {
        console.error('Failed to check SSO status:', error);
        setSSOStatus({ enabled: false, error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ssoStatus) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">SSO Status Check Failed</h3>
        </div>
        <p className="text-red-300">Unable to determine SSO configuration status.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        {ssoStatus.enabled ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
        <h3 className="text-lg font-semibold text-white">
          SSO Configuration Status
        </h3>
      </div>

      {ssoStatus.enabled ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Clerk SSO is configured and ready</span>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Available Providers:</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ssoProviders).map(([key, provider]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <span className="text-xl">{provider.icon}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{provider.name}</div>
                    <div className="text-gray-400 text-xs">Ready to use</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ssoStatus.setupRequired && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Production Setup Required</span>
              </div>
              <p className="text-yellow-300 text-sm">
                For production use, configure your own OAuth applications in the Clerk dashboard.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <XCircle className="w-4 h-4" />
            <span>SSO providers need to be configured</span>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Quick Setup Instructions:</h4>
            <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
              <li>Go to your Clerk Dashboard</li>
              <li>Navigate to "Social Connections"</li>
              <li>Enable Google, GitHub, LinkedIn providers</li>
              <li>Use "Clerk's shared OAuth app" for quick setup</li>
            </ol>
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Open Clerk Dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSOStatus;