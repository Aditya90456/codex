import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';
import CodexEditor from './components/CodexEditor';
import LoadingScreen from './components/LoadingScreen';
import ClerkSetupGuide from './components/Auth/ClerkSetupGuide';
import DefaultClerkAuth from './components/Auth/DefaultClerkAuth';
import { useState, useEffect } from 'react';
import './App.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validate Clerk key format
const isValidClerkKey = (key) => {
  if (!key) return false;
  // Basic validation for Clerk publishable key format
  return key.startsWith('pk_test_') || key.startsWith('pk_live_');
};

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [clerkError, setClerkError] = useState(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    // Ultra-fast app initialization
    const initApp = async () => {
      console.log('⚡ Codex Playground - Lightning fast initialization...');
      
      // Validate Clerk key
      if (PUBLISHABLE_KEY && !isValidClerkKey(PUBLISHABLE_KEY)) {
        setClerkError('Invalid Clerk publishable key format');
        console.error('❌ Invalid Clerk key format:', PUBLISHABLE_KEY);
      }
      
      // Minimal loading simulation for smooth UX
      const progressSteps = [
        { progress: 50, message: 'Loading lightning fast auth...' },
        { progress: 100, message: 'Ready! Welcome to Codex Playground...' }
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        const step = progressSteps[i];
        setLoadingProgress(step.progress);
        console.log(`⚡ ${step.message}`);
        
        // Ultra-fast loading - 100ms per step = 200ms total
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setIsAppReady(true);
      console.log('⚡ Codex Playground ready in 200ms!');
    };

    initApp();
  }, []);

  if (!isAppReady) {
    return (
      <LoadingScreen 
        progress={loadingProgress}
        message={
          loadingProgress < 50 ? 'Initializing Codex Playground...' :
          'Ready! Welcome to Codex Playground!'
        }
      />
    );
  }

  // Show error if Clerk key is missing or invalid
  if (!PUBLISHABLE_KEY || clerkError) {
    return (
      <>
        <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center text-white max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">⚠️ Clerk Configuration Required</h2>
            <p className="text-gray-400 mb-6">
              {!PUBLISHABLE_KEY 
                ? 'Please add your Clerk publishable key to .env file' 
                : `Invalid Clerk key: ${clerkError}`
              }
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setShowSetupGuide(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Setup Guide
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <ClerkSetupGuide 
          isOpen={showSetupGuide} 
          onClose={() => setShowSetupGuide(false)} 
        />
      </>
    );
  }

  // Wrap in error boundary for Clerk issues
  try {
    // Check if we're on auth routes
    const path = window.location.pathname;
    const isAuthRoute = path === '/sign-in' || path === '/sign-up';
    
    if (isAuthRoute) {
      return (
        <ClerkProvider 
          publishableKey={PUBLISHABLE_KEY}
          afterSignInUrl="/"
          afterSignUpUrl="/"
        >
          <DefaultClerkAuth mode={path === '/sign-up' ? 'signup' : 'signin'} />
        </ClerkProvider>
      );
    }

    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignInUrl={window.location.origin}
        afterSignUpUrl={window.location.origin}
        navigate={(to) => {
          // Prevent navigation to Clerk hosted pages
          console.log('Clerk trying to navigate to:', to);
          if (to.includes('clerk') || to.includes('sign-up') || to.includes('sign-in')) {
            console.log('Preventing navigation to Clerk hosted page');
            return;
          }
          // Allow other navigation
          window.location.href = to;
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
    console.error('Clerk initialization error:', error);
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">⚠️ Authentication Error</h2>
          <p className="text-gray-400 mb-6">
            Clerk authentication failed: {error.message}
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">
              Please check your Clerk configuration and try again.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}

export default App;