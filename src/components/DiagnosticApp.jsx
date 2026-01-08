import { useState, useEffect, useRef } from 'react';
import { ClerkProvider, useUser, useAuth } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const DiagnosticInner = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const [logs, setLogs] = useState([]);
  const renderCountRef = useRef(0);
  const [displayRenderCount, setDisplayRenderCount] = useState(0);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${message}`;
    console.log(`🔍 ${logEntry}`);
    setLogs(prev => [...prev.slice(-10), logEntry]);
  };

  // Track renders without causing loops
  renderCountRef.current += 1;
  
  // Update display count periodically, not on every render
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayRenderCount(renderCountRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    addLog('Component mounted');
    return () => addLog('Component unmounted');
  }, []);

  useEffect(() => {
    addLog(`Auth state changed: userLoaded=${userLoaded}, isSignedIn=${isSignedIn}`);
  }, [userLoaded, isSignedIn]);

  useEffect(() => {
    addLog(`User changed: ${user ? user.emailAddresses[0]?.emailAddress : 'null'}`);
  }, [user?.id]);

  return (
    <div className="h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Diagnostic</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current State</h2>
            <div className="space-y-2 text-sm font-mono">
              <div>Render Count: <span className="text-yellow-400">{displayRenderCount}</span></div>
              <div>User Loaded: <span className={userLoaded ? 'text-green-400' : 'text-red-400'}>{String(userLoaded)}</span></div>
              <div>Is Signed In: <span className={isSignedIn ? 'text-green-400' : 'text-red-400'}>{String(isSignedIn)}</span></div>
              <div>Has User: <span className={user ? 'text-green-400' : 'text-red-400'}>{String(!!user)}</span></div>
              <div>Clerk Key: <span className={PUBLISHABLE_KEY ? 'text-green-400' : 'text-red-400'}>{PUBLISHABLE_KEY ? 'Present' : 'Missing'}</span></div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            <pre className="text-xs text-green-400 overflow-auto max-h-40">
              {user ? JSON.stringify({
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName
              }, null, 2) : 'No user data'}
            </pre>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Real-time Log</h2>
          <div className="bg-black p-4 rounded font-mono text-xs max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">{log}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-lg mb-4">
            {displayRenderCount > 50 ? (
              <span className="text-red-400 font-bold">⚠️ INFINITE RENDER LOOP DETECTED! ({displayRenderCount} renders)</span>
            ) : displayRenderCount > 10 ? (
              <span className="text-yellow-400">⚠️ High render count: {displayRenderCount}</span>
            ) : (
              <span className="text-green-400">✅ Normal render count: {displayRenderCount}</span>
            )}
          </div>
          
          {userLoaded && !isSignedIn && (
            <div className="text-blue-400">
              Ready for authentication - no loops detected
            </div>
          )}
          
          {userLoaded && isSignedIn && user && (
            <div className="text-green-400">
              ✅ Successfully authenticated: {user.emailAddresses[0]?.emailAddress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DiagnosticApp = () => {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Missing Clerk Key</h1>
          <p>Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <DiagnosticInner />
    </ClerkProvider>
  );
};

export default DiagnosticApp;