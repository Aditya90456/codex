import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Globe, Key } from 'lucide-react';

const DeploymentDebug = () => {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isProduction = window.location.hostname !== 'localhost';
  
  const checks = [
    {
      name: 'Clerk Key Present',
      status: clerkKey ? 'pass' : 'fail',
      message: clerkKey ? 'Environment variable found' : 'VITE_CLERK_PUBLISHABLE_KEY missing'
    },
    {
      name: 'Clerk Key Format',
      status: clerkKey && (clerkKey.startsWith('pk_test_') || clerkKey.startsWith('pk_live_')) ? 'pass' : 'fail',
      message: clerkKey ? 
        (clerkKey.startsWith('pk_test_') || clerkKey.startsWith('pk_live_')) ? 'Valid format' : 'Invalid format - should start with pk_test_ or pk_live_'
        : 'No key to validate'
    },
    {
      name: 'Clerk Key Ending',
      status: clerkKey && !clerkKey.endsWith('$') ? 'pass' : 'fail',
      message: clerkKey ? 
        !clerkKey.endsWith('$') ? 'Valid ending' : 'Invalid - key ends with $ (corrupted)'
        : 'No key to validate'
    },
    {
      name: 'Environment',
      status: 'info',
      message: isProduction ? 'Production (Vercel)' : 'Development (localhost)'
    },
    {
      name: 'API URL',
      status: apiUrl ? 'pass' : 'warn',
      message: apiUrl || 'Not configured'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warn': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <Globe className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'fail': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Deployment Debug</h3>
      </div>
      
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start space-x-2">
            {getStatusIcon(check.status)}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-200">{check.name}</div>
              <div className={`text-xs ${getStatusColor(check.status)}`}>
                {check.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {clerkKey && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Key Preview: {clerkKey.substring(0, 15)}...
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          {isProduction ? '🌐 Vercel Production' : '💻 Local Development'}
        </div>
      </div>
    </div>
  );
};

export default DeploymentDebug;