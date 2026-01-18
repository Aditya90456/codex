import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/SimpleClerkAuth';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditor from './components/CodexEditor';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import VSCodeEditor from './components/VSCodeEditorClean';
import AndroidEditor from './components/AndroidEditor';
import { useState, useEffect } from 'react';
import { Code, LogOut, User, Home, Rocket, FolderOpen, Smartphone, Terminal } from 'lucide-react';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'editor', 'web-editor', 'vscode', 'android'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');
  const [showPublicLanding, setShowPublicLanding] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Debug: Log authentication state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 App Authentication State:');
      console.log('- isAuthenticated:', isAuthenticated);
      console.log('- loading:', loading);
      console.log('- showPublicLanding:', showPublicLanding);
      console.log('- showAuthModal:', showAuthModal);
      console.log('- user:', user);
    }
  }, [isAuthenticated, loading, showPublicLanding, showAuthModal, user]);

  // Handle logout
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      setCurrentView('welcome');
      setShowPublicLanding(true);
      setShowAuthModal(false);
    }
  }, [loading, isAuthenticated, isLoggingOut]);

  // Show auth modal
  useEffect(() => {
    if (!loading && !isAuthenticated && !showPublicLanding) {
      setShowAuthModal(true);
    } else if (isAuthenticated) {
      setShowAuthModal(false);
      setShowPublicLanding(false);
    }
  }, [loading, isAuthenticated, showPublicLanding]);

  if (loading || isLoggingOut) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>{isLoggingOut ? 'Logging out...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Public Landing Page - Shows first for non-authenticated users */}
      {!isAuthenticated && showPublicLanding && (
        <WelcomeScreenModern 
          onCreateNew={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowAuth={(mode) => {
            setShowPublicLanding(false);
            setAuthMode(mode === 'signup' ? 'sign-up' : 'sign-in');
          }}
          onShowDashboard={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-in');
          }}
        />
      )}

      {/* Auth Modal - Shows after user clicks sign up/sign in */}
      {showAuthModal && !showPublicLanding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Codex
              </h1>
              <p className="text-gray-600">
                {authMode === 'sign-in' 
                  ? 'Sign in to continue' 
                  : 'Create your account to get started'}
              </p>
            </div>

            {authMode === 'sign-in' ? (
              <div>
                <SignIn 
                  routing="virtual"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none"
                    }
                  }}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setAuthMode('sign-up')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <SignUp 
                  routing="virtual"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none"
                    }
                  }}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setAuthMode('sign-in')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main App - Only visible when authenticated */}
      {isAuthenticated && (
        <>
          {/* Navigation Bar - Only show on Editor view */}
          {currentView !== 'welcome' && (
            <div className="fixed top-4 right-4 z-40 flex gap-2">
              <button
                onClick={() => setCurrentView('welcome')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-white/10 text-white hover:bg-white/20"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              
              <button
                onClick={() => setCurrentView('editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'editor'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Code className="w-5 h-5" />
                Code Editor
              </button>
              
              <button
                onClick={() => setCurrentView('web-editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'web-editor'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Rocket className="w-5 h-5" />
                Web IDE
              </button>
              
              <button
                onClick={() => setCurrentView('vscode')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'vscode'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                VS Code
              </button>
              
              <button
                onClick={() => setCurrentView('android')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'android'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                Android
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg">
                <User className="w-5 h-5" />
                <span className="font-semibold">{user?.name}</span>
                <button
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await logout();
                      setCurrentView('welcome');
                      setShowPublicLanding(true);
                      setShowAuthModal(false);
                    } catch (error) {
                      console.error('Logout error:', error);
                    } finally {
                      setIsLoggingOut(false);
                    }
                  }}
                  className="ml-2 p-1 hover:bg-white/20 rounded transition-all"
                  title="Logout"
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {currentView === 'welcome' && (
            <WelcomeScreenModern 
              onCreateNew={() => {
                console.log('Opening editor');
                setCurrentView('editor');
              }}
              onShowAuth={() => {}}
              onShowDashboard={() => {}}
            />
          )}
          {currentView === 'editor' && <CodexEditor />}
          {currentView === 'web-editor' && <AdvancedWebEditor onBack={() => setCurrentView('welcome')} />}
          {currentView === 'vscode' && <VSCodeEditor onBack={() => setCurrentView('welcome')} />}
          {currentView === 'android' && <AndroidEditor onBack={() => setCurrentView('welcome')} />}
        </>
      )}
    </div>
  );
} 

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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
        <AuthenticatedApp />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;