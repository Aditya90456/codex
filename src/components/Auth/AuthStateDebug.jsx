import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import { useUser, useAuth } from '@clerk/clerk-react';

const AuthStateDebug = () => {
  const universalAuth = useUniversalAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">Auth State Debug</h3>
      <div className="space-y-1">
        <div>Clerk Loaded: {isLoaded ? '✅' : '❌'}</div>
        <div>Clerk Signed In: {isSignedIn ? '✅' : '❌'}</div>
        <div>Clerk User: {clerkUser ? '✅' : '❌'}</div>
        <div>Universal Auth Ready: {universalAuth.isReady ? '✅' : '❌'}</div>
        <div>Universal Auth User: {universalAuth.user ? '✅' : '❌'}</div>
        <div>Is Authenticated: {universalAuth.isAuthenticated ? '✅' : '❌'}</div>
        <div>Loading: {universalAuth.loading ? '⏳' : '✅'}</div>
        {universalAuth.user && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>Email: {universalAuth.user.email}</div>
            <div>Username: {universalAuth.user.username}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStateDebug;