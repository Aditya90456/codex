import { useUser } from '@clerk/clerk-react';
import { useAuthContext } from '../contexts/AuthContext';

const WelcomeScreenTest = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { user: contextUser, isSignedIn } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome Screen Diagnostic</h1>
      
      <div className="space-y-6">
        {/* Clerk Status */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Clerk Status</h2>
          <div className="space-y-2">
            <p>Loaded: {clerkLoaded ? '✅ Yes' : '❌ No'}</p>
            <p>User: {clerkUser ? '✅ Signed In' : '❌ Not Signed In'}</p>
            {clerkUser && (
              <div className="mt-4 p-4 bg-slate-700 rounded">
                <p>Name: {clerkUser.firstName} {clerkUser.lastName}</p>
                <p>Email: {clerkUser.primaryEmailAddress?.emailAddress}</p>
                <p>ID: {clerkUser.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Auth Context Status */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Auth Context Status</h2>
          <div className="space-y-2">
            <p>Signed In: {isSignedIn ? '✅ Yes' : '❌ No'}</p>
            <p>Context User: {contextUser ? '✅ Available' : '❌ Not Available'}</p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p>Clerk Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p>API URL: {import.meta.env.VITE_API_URL || 'Not set (will use default)'}</p>
          </div>
        </div>

        {/* Component Test */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Component Test</h2>
          <p className="mb-4">If you can see this, React is rendering correctly.</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            onClick={() => alert('Button works!')}
          >
            Test Button
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900 p-6 rounded-lg border-2 border-blue-500">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>If you see this page, routing is working ✅</li>
            <li>Check if Clerk is loaded above</li>
            <li>Verify environment variables are set</li>
            <li>If everything shows ✅, the issue is in WelcomeScreenModern component</li>
            <li>If something shows ❌, fix that first</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreenTest;
