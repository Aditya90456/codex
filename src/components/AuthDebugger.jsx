import { useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthDebugger = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-20), `${timestamp}: ${message}`]);
    console.log(`🔍 ${message}`);
  };

  useEffect(() => {
    addLog(`Clerk state: isLoaded=${isLoaded}, isSignedIn=${isSignedIn}, hasUser=${!!clerkUser}`);
  }, [isLoaded, isSignedIn, clerkUser]);

  useEffect(() => {
    addLog('AuthDebugger mounted');
    return () => addLog('AuthDebugger unmounted');
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-green-400 p-4 rounded-lg max-w-md max-h-64 overflow-y-auto text-xs font-mono">
      <div className="font-bold mb-2">Auth Debug Log:</div>
      {logs.map((log, index) => (
        <div key={index} className="mb-1">{log}</div>
      ))}
    </div>
  );
};

export default AuthDebugger;