import { useUser, useAuth } from '@clerk/clerk-react';
import { useAuth as useAppAuth } from '../../contexts/ClerkAuthContext';

const ClerkDebug = () => {
  const { user: clerkUser, isLoaded: userLoaded, isSignedIn: clerkSignedIn } = useUser();
  const { getToken, isSignedIn: authSignedIn } = useAuth();
  const { user: appUser, loading: appLoading, isAuthenticated } = useAppAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 text-xs text-white max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Clerk Debug</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Clerk Status:</strong>
          <div className="ml-2">
            <div>User Loaded: {userLoaded ? '✅' : '❌'}</div>
            <div>Signed In (Clerk): {clerkSignedIn ? '✅' : '❌'}</div>
            <div>Signed In (Auth): {authSignedIn ? '✅' : '❌'}</div>
          </div>
        </div>

        <div>
          <strong>App Status:</strong>
          <div className="ml-2">
            <div>App Loading: {appLoading ? '⏳' : '✅'}</div>
            <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
          </div>
        </div>

        <div>
          <strong>User Data:</strong>
          <div className="ml-2">
            <div>Clerk User: {clerkUser ? '✅' : '❌'}</div>
            <div>App User: {appUser ? '✅' : '❌'}</div>
            {appUser && (
              <div className="text-green-400">
                {appUser.username || appUser.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <strong>Environment:</strong>
          <div className="ml-2">
            <div>Publishable Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅' : '❌'}</div>
            <div>API URL: {import.meta.env.VITE_API_BASE_URL || 'default'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkDebug;