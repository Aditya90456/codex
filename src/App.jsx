import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';
import CodexEditor from './components/CodexEditor';
import LoadingScreen from './components/LoadingScreen';
import { useState, useEffect } from 'react';
import './App.css';
  

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
  throw new Error("Missing Publishable Key - Please check your .env file")
}

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Fast app initialization with progress
    const initApp = async () => {
      console.log('🚀 Codex Playground - Fast initialization starting...');
      
      // Simulate fast loading with progress
      const progressSteps = [
        { progress: 20, message: 'Loading Clerk authentication...' },
        { progress: 40, message: 'Initializing Monaco Editor...' },
        { progress: 60, message: 'Setting up development environment...' },
        { progress: 80, message: 'Preparing Codex Playground...' },
        { progress: 100, message: 'Ready! Redirecting to playground...' }
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        const step = progressSteps[i];
        setLoadingProgress(step.progress);
        console.log(`⚡ ${step.message}`);
        
        // Fast loading - 400ms per step = 2s total
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      setIsAppReady(true);
      console.log('✅ Codex Playground ready in 2 seconds!');
    };

    initApp();
  }, []);

  if (!isAppReady) {
    return (
      <LoadingScreen 
        progress={loadingProgress}
        message={
          loadingProgress < 20 ? 'Initializing Codex Playground...' :
          loadingProgress < 40 ? 'Loading authentication...' :
          loadingProgress < 60 ? 'Setting up editors...' :
          loadingProgress < 80 ? 'Preparing development tools...' :
          loadingProgress < 100 ? 'Almost ready...' :
          'Welcome to Codex Playground!'
        }
      />
    );
  }

  try {
    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: 'dark',
          variables: {
            colorPrimary: '#7C3AED',
            colorBackground: '#0F172A',
            colorInputBackground: '#1E293B',
            colorInputText: '#F1F5F9',
          },
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
            card: 'bg-slate-900 border border-slate-700',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-300',
          }
        }}
      >
        <ClerkAuthProvider>
          <div className="App">
            <CodexEditor />
          </div>
        </ClerkAuthProvider>
      </ClerkProvider>
    );
  } catch (error) {
    console.error('App initialization error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Codex Playground Error</h1>
          <p className="text-gray-400 mb-4">Failed to initialize the application.</p>
          <p className="text-sm text-gray-500">Please refresh the page or check the console for details.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
          >
            Reload Codex Playground
          </button>
        </div>
      </div>
    );
  }
}

export default App;