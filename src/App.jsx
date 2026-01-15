import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/SimpleClerkAuth';
import WelcomeScreenRedesigned from './components/WelcomeScreenRedesigned';
import CodexEditor from './components/CodexEditor';
import DSAGame from './components/DSA/DSAGame';
import { useState, useEffect } from 'react';
import { Gamepad2, Code, LogOut, User, Home } from 'lucide-react';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Global navigation function that can be called from anywhere
window.navigateToGame = () => {
  const event = new CustomEvent('forceNavigateToGame');
  window.dispatchEvent(event);
};

function AuthenticatedApp() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'editor', or 'game'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up'); // 'sign-in' or 'sign-up' - Default to sign-up for new users
  const [showPublicLanding, setShowPublicLanding] = useState(true); // Show public landing first
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout state

  // Debug: Log authentication state changes - Development only
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

  // Emergency navigation event listener
  useEffect(() => {
    const handleNavigateToGame = (event) => {
      console.log('🚨 Emergency navigation event received:', event.detail);
      setCurrentView('game');
    };

    const handleForceNavigateToGame = () => {
      console.log('🚨 FORCE navigate to game!');
      setCurrentView('game');
    };

    window.addEventListener('navigateToGame', handleNavigateToGame);
    window.addEventListener('forceNavigateToGame', handleForceNavigateToGame);
    
    return () => {
      window.removeEventListener('navigateToGame', handleNavigateToGame);
      window.removeEventListener('forceNavigateToGame', handleForceNavigateToGame);
    };
  }, []);

  // Handle logout - reset to public landing when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      setCurrentView('welcome');
      setShowPublicLanding(true);
      setShowAuthModal(false);
    }
  }, [loading, isAuthenticated, isLoggingOut]);

  // Show auth modal only when user clicks sign up/sign in from landing page
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
        <WelcomeScreenRedesigned 
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
          onShowGame={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowWebEditor={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowAdvancedWebEditor={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowAndroidEditor={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowRoadmap={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowDSAComic={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowArticles={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowCodexRedesigned={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
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

      {/* Development Test Buttons - Hidden in production */}
      {isAuthenticated && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <button
            onClick={() => {
              console.log('🔥 DIRECT GAME TEST FROM APP');
              console.log('Current view before:', currentView);
              setCurrentView('game');
              console.log('View changed to: game');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700"
          >
            🎮 DEV TEST
          </button>
          <button
            onClick={() => setCurrentView('welcome')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            WELCOME
          </button>
        </div>
      )}

      {/* Floating DSA Game Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            if (isAuthenticated) {
              setCurrentView('game');
            } else {
              alert('Please sign in first to play the DSA Game!');
            }
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
          title="Play DSA Game"
        >
          <Gamepad2 className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>

      {/* Main App - Only visible when authenticated */}
      {isAuthenticated && (
        <>
          {/* Debug Button - Remove after testing */}
          <button
            onClick={() => {
              console.log('Debug: Forcing game view');
              setCurrentView('game');
            }}
            className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700"
          >
            Test Game
          </button>

          {/* Navigation Bar - Only show on Editor and Game views */}
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
                Editor
              </button>
              <button
                onClick={() => setCurrentView('game')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'game'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                DSA Game
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
                      // Force reset to public landing
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
            <WelcomeScreenRedesigned 
              onCreateNew={() => {
                console.log('Opening editor');
                setCurrentView('editor');
              }}
              onShowAuth={() => {}}
              onShowDashboard={() => {}}
              onShowGame={() => {
                console.log('🎮 DSA Game button clicked from WelcomeScreenRedesigned');
                console.log('Current view before:', currentView);
                setCurrentView('game');
                console.log('View set to: game');
              }}
              onShowWebEditor={() => setCurrentView('editor')}
              onShowAdvancedWebEditor={() => setCurrentView('editor')}
              onShowAndroidEditor={() => setCurrentView('editor')}
              onShowRoadmap={() => {}}
              onShowDSAComic={() => {}}
              onShowArticles={() => {}}
              onShowCodexRedesigned={() => setCurrentView('editor')}
            />
          )}
          {currentView === 'editor' && <CodexEditor />}
          {currentView === 'game' && (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              {/* Game Navigation Header */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">DSA Master Game</h1>
                      <p className="text-sm text-purple-200">Interactive Data Structures & Algorithms Learning</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setCurrentView('welcome')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>
                    
                    <button
                      onClick={() => setCurrentView('editor')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      <Code className="w-4 h-4" />
                      <span>Editor</span>
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Content */}
              <div className="p-4">
                <DSAGame />
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-sm z-50 hidden">
            Current View: {currentView}
          </div>
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