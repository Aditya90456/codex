import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/SimpleClerkAuth';
import { useState, useEffect } from 'react';
import SimpleCodexEditor from './components/SimpleCodexEditor';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple initialization without artificial delays
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Missing Clerk Key</div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <div className="App">
          <SimpleCodexEditor />
        </div>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;