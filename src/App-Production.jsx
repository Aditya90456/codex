import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/SimpleClerkAuth';
import CodexEditor from './components/CodexEditor';
import { useState, useEffect } from 'react';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple initialization
    console.log('🚀 Codex Playground - Production Mode');
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Codex Playground...</div>
      </div>
    );
  }

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">⚠️ Configuration Required</h2>
          <p className="text-gray-400 mb-6">
            Please add your Clerk publishable key to the .env file
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              Add: VITE_CLERK_PUBLISHABLE_KEY=your_key_here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <div className="App">
          <CodexEditor />
        </div>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;