import { useAuth, useUser } from '@clerk/clerk-react';

const ClerkTest = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading Clerk...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">Clerk Status</h3>
      <div className="space-y-1 text-sm">
        <div>Loaded: {isLoaded ? '✅' : '❌'}</div>
        <div>Signed In: {isSignedIn ? '✅' : '❌'}</div>
        {user && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>ID: {user.id}</div>
            <div>Email: {user.emailAddresses[0]?.emailAddress}</div>
            <div>Username: {user.username || 'Not set'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkTest;