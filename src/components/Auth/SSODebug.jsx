import { useEffect, useState } from 'react';

const SSODebug = () => {
  const [ssoStatus, setSsoStatus] = useState({
    googleEnabled: false,
    githubEnabled: false,
    linkedinEnabled: false,
    clerkLoaded: false,
    errors: []
  });

  useEffect(() => {
    // Check if Clerk is loaded and SSO providers are available
    const checkSSOStatus = () => {
      try {
        // Check if Clerk is available
        const clerkLoaded = window.Clerk !== undefined;
        
        // Check for social provider buttons in the DOM
        const googleButton = document.querySelector('[data-clerk-oauth="oauth_google"]');
        const githubButton = document.querySelector('[data-clerk-oauth="oauth_github"]');
        const linkedinButton = document.querySelector('[data-clerk-oauth="oauth_linkedin"]');

        setSsoStatus({
          googleEnabled: !!googleButton,
          githubEnabled: !!githubButton,
          linkedinEnabled: !!linkedinButton,
          clerkLoaded,
          errors: []
        });
      } catch (error) {
        setSsoStatus(prev => ({
          ...prev,
          errors: [...prev.errors, error.message]
        }));
      }
    };

    // Check immediately and then periodically
    checkSSOStatus();
    const interval = setInterval(checkSSOStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 p-4 bg-blue-900 text-white rounded-lg shadow-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">SSO Debug Status</h3>
      <div className="space-y-1">
        <div>Clerk Loaded: {ssoStatus.clerkLoaded ? '✅' : '❌'}</div>
        <div>Google SSO: {ssoStatus.googleEnabled ? '✅' : '❌'}</div>
        <div>GitHub SSO: {ssoStatus.githubEnabled ? '✅' : '❌'}</div>
        <div>LinkedIn SSO: {ssoStatus.linkedinEnabled ? '✅' : '❌'}</div>
        
        {ssoStatus.errors.length > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-700">
            <div className="text-red-300">Errors:</div>
            {ssoStatus.errors.map((error, index) => (
              <div key={index} className="text-red-200 text-xs">{error}</div>
            ))}
          </div>
        )}
        
        {!ssoStatus.googleEnabled && !ssoStatus.githubEnabled && !ssoStatus.linkedinEnabled && (
          <div className="mt-2 pt-2 border-t border-blue-700">
            <div className="text-yellow-300">⚠️ No SSO providers detected</div>
            <div className="text-yellow-200 text-xs">
              Configure social providers in Clerk dashboard
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-blue-700">
        <a 
          href="https://dashboard.clerk.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-100 text-xs underline"
        >
          Open Clerk Dashboard →
        </a>
      </div>
    </div>
  );
};

export default SSODebug;