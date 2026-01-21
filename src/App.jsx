import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/SimpleClerkAuth';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditor from './components/CodexEditor';
import CodexEditorModern from './components/CodexEditorModern';
import CodexEditorUltra from './components/CodexEditorUltra';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import VSCodeEditor from './components/VSCodeEditorClean';
import AndroidEditor from './components/AndroidEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import VisualTutorials from './components/DSA/VisualTutorials';
import InterviewReady from './components/DSA/InterviewReady';
import StriverTributePage from './pages/StriverTributePage';
import MobileNav from './components/MobileNav';
import { useState, useEffect } from 'react';
import { Code, LogOut, User, Home, Rocket, FolderOpen, Smartphone, Trophy } from 'lucide-react';
import './App.css';
import './styles/responsive.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');
  const [showPublicLanding, setShowPublicLanding] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log authentication state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 App Authentication State:');
      console.log('- isAuthenticated:', isAuthenticated);
      console.log('- loading:', loading);
      console.log('- showPublicLanding:', showPublicLanding);
      console.log('- showAuthModal:', showAuthModal);
      console.log('- user:', user);
      console.log('- current path:', location.pathname);
    }
  }, [isAuthenticated, loading, showPublicLanding, showAuthModal, user, location.pathname]);

  // Handle logout
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      setShowPublicLanding(true);
      setShowAuthModal(false);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, isLoggingOut, navigate, location.pathname]);

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
      {!isAuthenticated && showPublicLanding && location.pathname === '/' && (
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
          {/* Mobile Navigation */}
          <MobileNav user={user} onLogout={async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              navigate('/');
              setShowPublicLanding(true);
              setShowAuthModal(false);
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setIsLoggingOut(false);
            }
          }} />

          {/* Desktop Navigation Bar - Only show on non-home routes */}
          {location.pathname !== '/' && (
            <div className="hidden md:flex fixed top-4 right-4 z-50 gap-2 desktop-nav">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-white/10 text-white hover:bg-white/20"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              
              <button
                onClick={() => navigate('/editor-modern')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  location.pathname.startsWith('/editor')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Code className="w-5 h-5" />
                Editor
              </button>
              
              <button
                onClick={() => navigate('/web-editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  location.pathname === '/web-editor'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Rocket className="w-5 h-5" />
                Web IDE
              </button>
              
              <button
                onClick={() => navigate('/vscode')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  location.pathname === '/vscode'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                VS Code
              </button>
              
              <button
                onClick={() => navigate('/android')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  location.pathname === '/android'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                Android
              </button>

              <button
                onClick={() => navigate('/dsa')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  location.pathname.startsWith('/dsa')
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Trophy className="w-5 h-5" />
                DSA
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
                      navigate('/');
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

          {/* Routes */}
          <Routes>
            <Route 
              path="/" 
              element={
                <WelcomeScreenModern 
                  onCreateNew={() => navigate('/editor-modern')}
                  onShowAuth={() => {}}
                  onShowDashboard={() => {}}
                />
              } 
            />
            <Route path="/editor" element={<CodexEditor />} />
            <Route path="/editor-modern" element={<CodexEditorModern />} />
            <Route path="/editor-ultra" element={<CodexEditorUltra onBack={() => navigate('/')} />} />
            <Route path="/web-editor" element={<AdvancedWebEditor onBack={() => navigate('/')} />} />
            <Route path="/vscode" element={<VSCodeEditor onBack={() => navigate('/')} />} />
            <Route path="/android" element={<AndroidEditor onBack={() => navigate('/')} />} />
            <Route path="/dsa" element={<DSA250Awesome onBack={() => navigate('/')} />} />
            <Route path="/dsa/tutorials" element={<VisualTutorials onBack={() => navigate('/')} />} />
            <Route path="/dsa/interview" element={<InterviewReady onBack={() => navigate('/')} />} />
            <Route path="/dsa/tribute" element={<StriverTributePage onBack={() => navigate('/')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}

      {/* Redirect non-authenticated users trying to access protected routes */}
      {!isAuthenticated && location.pathname !== '/' && (
        <Navigate to="/" replace />
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
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;